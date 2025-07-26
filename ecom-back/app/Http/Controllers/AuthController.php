<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'verification_token' => Str::random(60)
        ]);

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'User registered successfully. Please verify your email.'
        ], 201);
    }

    public function verify(Request $request, $token)
    {
        $user = User::where('verification_token', $token)->firstOrFail();
        $user->markEmailAsVerified();
        
        return response()->json(['message' => 'Email verified successfully']);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = $request->user();
        
        if (!$user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email not verified'], 403);
        }

        // This will set the Sanctum cookie automatically
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token // Only needed if using token-based auth alongside cookies
        ])->withCookie(cookie(
            'auth_token', 
            $token,
            config('sanctum.expiration'),
            '/',
            null,
            true, // secure
            true, // httpOnly
            false,
            'Lax'
        ));
    }

    public function logout(Request $request)
    {
        // Revoke all tokens (if using tokens)
        $request->user()->tokens()->delete();
        
        // Clear the cookie
        return response()->json(['message' => 'Logged out'])
            ->withoutCookie('auth_token');
    }

    public function resend(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified']);
        }

        $request->user()->sendEmailVerificationNotification();
        
        return response()->json(['message' => 'Verification email resent']);
    }
}
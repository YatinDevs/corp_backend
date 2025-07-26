<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers;
use App\Models\Category;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $navigationGroup = 'Shop';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Basic Information')
                    ->schema([
                        Forms\Components\Select::make('category_id')
                            ->relationship('category', 'name')
                            ->searchable()
                            ->preload()
                            ->createOptionForm([
                                Forms\Components\TextInput::make('name')
                                    ->required(),
                                Forms\Components\TextInput::make('slug')
                                    ->required(),
                            ]),
                            
                        Forms\Components\TextInput::make('product_code')
                            ->required()
                            ->maxLength(255)
                            ->unique(Product::class, 'product_code', ignoreRecord: true),
                            
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set) => $operation === 'create' ? $set('slug', Str::slug($state)) : null),
                            
                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(Product::class, 'slug', ignoreRecord: true),
                            
                        Forms\Components\Textarea::make('description')
                            ->columnSpanFull(),
                            
                        Forms\Components\FileUpload::make('images')
                            ->image()
                            ->multiple()
                            ->directory('products')
                            ->maxFiles(5)
                            ->reorderable(),
                            
                        Forms\Components\Toggle::make('is_active')
                            ->required(),
                            
                        Forms\Components\Toggle::make('is_featured')
                            ->required(),
                            
                        Forms\Components\Select::make('type')
                            ->options([
                                'single' => 'Single Product',
                                'combo' => 'Combo Pack',
                            ])
                            ->required()
                            ->live(),
                    ])->columns(2),
                    
                Forms\Components\Section::make('Pricing & Inventory')
                    ->schema([
                        Forms\Components\TextInput::make('price')
                            ->required()
                            ->numeric()
                            ->prefix('$'),
                            
                        Forms\Components\TextInput::make('cost_price')
                            ->numeric()
                            ->prefix('$')
                            ->visible(fn (Forms\Get $get): bool => $get('type') === 'single'),
                            
                        Forms\Components\TextInput::make('discount_price')
                            ->numeric()
                            ->prefix('$')
                            ->visible(fn (Forms\Get $get): bool => $get('type') === 'combo'),
                            
                        Forms\Components\TextInput::make('stock_quantity')
                            ->numeric()
                            ->visible(fn (Forms\Get $get): bool => $get('type') === 'single'),
                            
                        Forms\Components\TextInput::make('min_stock_threshold')
                            ->numeric()
                            ->visible(fn (Forms\Get $get): bool => $get('type') === 'single'),
                            
                        Forms\Components\TextInput::make('sku')
                            ->maxLength(255)
                            ->visible(fn (Forms\Get $get): bool => $get('type') === 'single'),
                            
                        Forms\Components\TextInput::make('barcode')
                            ->maxLength(255)
                            ->visible(fn (Forms\Get $get): bool => $get('type') === 'single'),
                    ])->columns(3),
                    
                Forms\Components\Section::make('Shipping Information')
                    ->schema([
                        Forms\Components\Toggle::make('requires_shipping')
                            ->default(true),
                            
                        Forms\Components\TextInput::make('package_length')
                            ->numeric()
                            ->suffix('cm'),
                            
                        Forms\Components\TextInput::make('package_width')
                            ->numeric()
                            ->suffix('cm'),
                            
                        Forms\Components\TextInput::make('package_height')
                            ->numeric()
                            ->suffix('cm'),
                            
                        Forms\Components\TextInput::make('package_weight')
                            ->numeric()
                            ->suffix('kg'),
                    ])->columns(2),
                    
                Forms\Components\Section::make('Combo Products')
                    ->schema([
                        Forms\Components\Repeater::make('combo_products')
                            ->schema([
                                Forms\Components\Select::make('product_id')
                                    ->relationship('products', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required(),
                                    
                                Forms\Components\TextInput::make('quantity')
                                    ->numeric()
                                    ->default(1)
                                    ->required(),
                            ])
                            ->columns(2)
                            ->visible(fn (Forms\Get $get): bool => $get('type') === 'combo'),
                    ]),
                    
                Forms\Components\Section::make('Specifications')
                    ->schema([
                        Forms\Components\KeyValue::make('specifications')
                            ->keyLabel('Property')
                            ->valueLabel('Value')
                            ->visible(fn (Forms\Get $get): bool => $get('type') === 'single'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('images')
                    ->label('Image')
                    ->stacked()
                    ->limit(1)
                    ->circular(),
                    
                Tables\Columns\TextColumn::make('product_code')
                    ->searchable(),
                    
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                    
                Tables\Columns\TextColumn::make('category.name')
                    ->sortable(),
                    
                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'single' => 'success',
                        'combo' => 'warning',
                    }),
                    
                Tables\Columns\TextColumn::make('price')
                    ->money()
                    ->sortable(),
                    
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean(),
                    
                Tables\Columns\IconColumn::make('is_featured')
                    ->boolean(),
            ])
            ->filters([
                Tables\Filters\TrashedFilter::make(),
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'single' => 'Single',
                        'combo' => 'Combo',
                    ]),
                Tables\Filters\SelectFilter::make('category_id')
                    ->label('Category')
                    ->options(Category::pluck('name', 'id')),
                Tables\Filters\SelectFilter::make('is_active')
                    ->options([
                        '1' => 'Active',
                        '0' => 'Inactive',
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
                Tables\Actions\ForceDeleteAction::make(),
                Tables\Actions\RestoreAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'view' => Pages\ViewProduct::route('/{record}'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
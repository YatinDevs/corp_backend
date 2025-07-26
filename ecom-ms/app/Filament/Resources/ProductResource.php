<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Models\Category;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Unique;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;
    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';
    protected static ?string $modelLabel = 'Product';
    protected static ?string $navigationGroup = 'Shop';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Basic Information')
                    ->description('Core product details')
                    ->collapsible()
                    ->schema([
                        Forms\Components\Select::make('category_id')
                            ->relationship('category', 'name')
                            ->searchable()
                            ->preload()
                            ->createOptionForm([
                                Forms\Components\TextInput::make('name')->required(),
                                Forms\Components\TextInput::make('slug')->required(),
                            ])
                            ->label('Category'),
                            
                        Forms\Components\TextInput::make('product_code')
                            ->required()
                            ->maxLength(50)
                            ->unique(Product::class, 'product_code', ignoreRecord: true)
                            ->rules([
                                fn (Forms\Get $get) => (new Unique('products', 'product_code'))
                                    ->whereNull('deleted_at')
                                    ->ignore($get('id'))
                            ])
                            ->label('Product Code'),
                            
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (string $operation, $state, Forms\Set $set) {
                                if ($operation === 'create') {
                                    $set('slug', Str::slug($state));
                                    $set('product_code', strtoupper(Str::random(8)));
                                }
                            }),
                            
                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(Product::class, 'slug', ignoreRecord: true)
                            ->rules([
                                fn (Forms\Get $get) => (new Unique('products', 'slug'))
                                    ->whereNull('deleted_at')
                                    ->ignore($get('id'))
                            ]),
                            
                        Forms\Components\Textarea::make('description')
                            ->maxLength(1000)
                            ->columnSpanFull(),
                            
                       Forms\Components\FileUpload::make('images')
                            ->image()
                            ->multiple()
                            ->directory('products')
                            ->maxFiles(5)
                            ->reorderable()
                            ->imageEditor()
                            ->imageResizeMode('cover')
                            ->imageCropAspectRatio('1:1')
                            ->maxSize(2048),
                        Forms\Components\Toggle::make('is_active')
                            ->default(true)
                            ->required()
                            ->inline(false),
                            
                        Forms\Components\Toggle::make('is_featured')
                            ->required()
                            ->inline(false),
                            
                        Forms\Components\Select::make('type')
                            ->options([
                                'single' => 'Single Product',
                                'combo' => 'Combo Pack',
                            ])
                            ->required()
                            ->live()
                            ->native(false)
                            ->afterStateUpdated(function ($state, Forms\Set $set) {
                                if ($state === 'combo') {
                                    $set('stock_quantity', 0);
                                    $set('min_stock_threshold', 0);
                                    $set('sku', null);
                                    $set('barcode', null);
                                }
                            }),
                    ])
                    ->columns(2),
                    
                Forms\Components\Section::make('Pricing & Inventory')
                    ->collapsible()
                    ->schema([
                        Forms\Components\TextInput::make('price')
                            ->required()
                            ->numeric()
                            ->minValue(0.01)
                            ->prefix('$')
                            ->step(0.01),
                            
                        Forms\Components\TextInput::make('cost_price')
                            ->numeric()
                            ->minValue(0)
                            ->prefix('$')
                            ->step(0.01)
                            ->visible(fn (Forms\Get $get): bool => $get('type') === 'single'),
                            
                        Forms\Components\TextInput::make('discount_price')
                            ->numeric()
                            ->minValue(0)
                            ->prefix('$')
                            ->step(0.01)
                            ->visible(fn (Forms\Get $get): bool => $get('type') === 'combo')
                            ->lte('price'),
                            
                        Forms\Components\TextInput::make('stock_quantity')
                            ->numeric()
                            ->minValue(0)
                            ->visible(fn (Forms\Get $get): bool => $get('type') === 'single'),
                            
                        Forms\Components\TextInput::make('min_stock_threshold')
                            ->numeric()
                            ->minValue(0)
                            ->visible(fn (Forms\Get $get): bool => $get('type') === 'single'),
                            
                        Forms\Components\TextInput::make('sku')
                            ->maxLength(50)
                            ->unique(Product::class, 'sku', ignoreRecord: true)
                            ->rules([
                                fn (Forms\Get $get) => (new Unique('products', 'sku'))
                                    ->whereNull('deleted_at')
                                    ->ignore($get('id'))
                            ])
                            ->visible(fn (Forms\Get $get): bool => $get('type') === 'single'),
                            
                        Forms\Components\TextInput::make('barcode')
                            ->maxLength(50)
                            ->visible(fn (Forms\Get $get): bool => $get('type') === 'single'),
                    ])
                    ->columns(3),
                    
                Forms\Components\Section::make('Shipping Information')
                    ->collapsible()
                    ->schema([
                        Forms\Components\Toggle::make('requires_shipping')
                            ->default(true)
                            ->inline(false),
                            
                        Forms\Components\TextInput::make('package_length')
                            ->numeric()
                            ->minValue(0)
                            ->suffix('cm'),
                            
                        Forms\Components\TextInput::make('package_width')
                            ->numeric()
                            ->minValue(0)
                            ->suffix('cm'),
                            
                        Forms\Components\TextInput::make('package_height')
                            ->numeric()
                            ->minValue(0)
                            ->suffix('cm'),
                            
                        Forms\Components\TextInput::make('package_weight')
                            ->numeric()
                            ->minValue(0)
                            ->suffix('kg'),
                    ])
                    ->columns(2),
                    
                Forms\Components\Section::make('Combo Products')
                    ->collapsible()
                    ->visible(fn (Forms\Get $get): bool => $get('type') === 'combo')
                    ->schema([
                        Forms\Components\Repeater::make('combo_products')
                            ->schema([
                                Forms\Components\Select::make('product_id')
                                    ->label('Product')
                                    ->options(Product::query()->where('type', 'single')->pluck('name', 'id'))
                                    ->searchable()
                                    ->required(),
                                    
                                Forms\Components\TextInput::make('quantity')
                                    ->numeric()
                                    ->minValue(1)
                                    ->default(1)
                                    ->required(),
                            ])
                            ->columns(2)
                            ->itemLabel(fn (array $state): ?string => Product::find($state['product_id'])?->name)
                            ->addActionLabel('Add Product')
                            ->defaultItems(1)
                            ->collapsible(),
                    ]),
                    
                Forms\Components\Section::make('Specifications')
                    ->collapsible()
                    ->visible(fn (Forms\Get $get): bool => $get('type') === 'single')
                    ->schema([
                        Forms\Components\KeyValue::make('specifications')
                            ->keyLabel('Property')
                            ->valueLabel('Value')
                            ->addable()
                            ->deletable()
                            ->reorderable(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('images')
                    ->label('')
                    ->circular()
                    ->stacked()
                    ->limit(1)
                    ->size(40),
                    
                Tables\Columns\TextColumn::make('product_code')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),
                    
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->wrap(),
                    
                Tables\Columns\TextColumn::make('category.name')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                    
                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'single' => 'success',
                        'combo' => 'warning',
                    })
                    ->sortable(),
                    
                Tables\Columns\TextColumn::make('price')
                    ->money()
                    ->sortable(),
                    
                Tables\Columns\TextColumn::make('discount_price')
                    ->label('Discounted Price')
                    ->money()
                    ->color('success')
                    ->sortable()
                    ->visible(fn (?Product $record): bool => $record?->type === 'combo'),
                    
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->sortable()
                    ->label('Active'),
                    
                Tables\Columns\IconColumn::make('is_featured')
                    ->boolean()
                    ->sortable()
                    ->label('Featured'),
                    
                Tables\Columns\TextColumn::make('stock_quantity')
                    ->numeric()
                    ->sortable()
                    ->visible(fn (?Product $record): bool => $record?->type === 'single'),
                    
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                    
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
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
                    ])
                    ->label('Status'),
                Tables\Filters\SelectFilter::make('is_featured')
                    ->options([
                        '1' => 'Featured',
                        '0' => 'Not Featured',
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
                ]),
            ])
            ->emptyStateActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->defaultSort('created_at', 'desc')
            ->persistSortInSession();
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                \Illuminate\Database\Eloquent\SoftDeletingScope::class,
            ]);
    }
}
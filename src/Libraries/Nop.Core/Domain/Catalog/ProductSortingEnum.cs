namespace Nop.Core.Domain.Catalog;

/// <summary>
/// Represents the product sorting
/// </summary>
public enum ProductSortingEnum
{
    /// <summary>
    /// Position (display order)
    /// </summary>
    Position = 0,

    /// <summary>
    /// Name: A to Z
    /// </summary>
    NameAsc = 5,

    /// <summary>
    /// Name: Z to A
    /// </summary>
    NameDesc = 6,

    /// <summary>
    /// Price: Low to High
    /// </summary>
    PriceAsc = 10,

    /// <summary>
    /// Price: High to Low
    /// </summary>
    PriceDesc = 11,

    /// <summary>
    /// Product creation date
    /// </summary>
    CreatedOn = 15,

    /// <summary>
    /// Product creation date: newest first
    /// </summary>
    CreatedOnDesc = 16,

    /// <summary>
    /// SKU: A to Z
    /// </summary>
    SkuAsc = 20,

    /// <summary>
    /// SKU: Z to A
    /// </summary>
    SkuDesc = 21,

    /// <summary>
    /// Stock quantity: Low to High
    /// </summary>
    StockQuantityAsc = 25,    /// <summary>
                              /// Stock quantity: High to Low
                              /// </summary>
    StockQuantityDesc = 26,

    /// <summary>
    /// Published: Yes to No
    /// </summary>
    PublishedAsc = 30,

    /// <summary>
    /// Published: No to Yes
    /// </summary>
    PublishedDesc = 31,
}
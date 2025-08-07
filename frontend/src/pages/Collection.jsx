import React, { useState, useEffect, useContext } from "react";
import{assets} from "../assets/assets"
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { ShopContext } from "../context/ShopContext";

const Collection = () => {
  const {search, showSearch, backendUrl, products = []} = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  //  {toggle sub category}

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  //  {applyFilter}

  const applyFilter = () => {
    let productsCopy = (products || []).slice();

    if (search && showSearch){  // for sarch filter
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    // Filter by category
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    // Filter by type subcategory
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
  };

  useEffect(() => {
    setFilterProducts(products || []);
  }, [products]);

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch(sortType){
      case "low-high":
        setFilterProducts(fpCopy.sort((a,b) => (a.price - b.price)));
        break;

        case "high-low":
          setFilterProducts(fpCopy.sort((a,b) =>(b.price - a.price)));
          break;

          default:
            applyFilter();
            break;
    }

  }



  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search,showSearch,products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  // Helper function to get image URL
  const getImageUrl = (product) => {
    const imgArr = product.images || product.Image || product.image || [];
    const imageUrl = imgArr?.[0]
      ? imgArr[0].startsWith("http")
        ? imgArr[0]
        : `${backendUrl}/uploads/${imgArr[0]}`
      : "/placeholder.jpg";
    return imageUrl;
  };

  // Debug: Log products and their first image
  console.log('PRODUCTS:', filterProducts.map(p => ({id: p._id, img: getImageUrl(p)})));

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          }`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <label className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Men"
                onChange={toggleCategory}
              />{" "}
              Men
            </label>
            <label className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Women"
                onChange={toggleCategory}
              />{" "}
              Women
            </label>
            <label className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Kids"
                onChange={toggleCategory}
              />{" "}
              Kids
            </label>
          </div>
        </div>

        {/* {sub Category} */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          }`}
        >
          <p className="mb-3 text-sm font-medium">Type</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <label className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Topwear"}
                onChange={toggleSubCategory}
              />
              Topwear
            </label>
            <label className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Bottomwear"}
                onChange={toggleSubCategory}
              />
              Bottomwear
            </label>
            <label className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Winterwear"}
                onChange={toggleSubCategory}
              />
              Winterwear
            </label>
          </div>
        </div>
      </div>
      {/* {rightside} */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-5">
          <Title text1={"ALL"} text2={"COLLECTION"} />
          {/* {products short filter} */}
          <select onChange={(e) => setSortType(e.target.value)} className="border-2 border-gray-300 px-2 ">
            <option value="relevent">Sort by: Relavent</option>
            <option value="low-high">Sort by: Low-High</option>
            <option value="high-low">Sort by: High-Low</option>
          </select>
        </div>
        {/* {map product} */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {filterProducts.map((product, index) => (
            <ProductItem
              key={product._id}
              product={product}
              imageUrl={getImageUrl(product)}
              errorFallback={() => "/placeholder.jpg"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Collection;

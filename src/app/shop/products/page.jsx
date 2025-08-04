// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Image from "next/image";
// import { CartItem, Product } from "@/lib/types";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import { useCart } from "@/context/CartContext";
// import { getAllProducts } from "@/actions/publicActions";

// const CATEGORIES = [
//   "All Products",
//   "Football Boots",
//   "Jerseys",
//   "Balls",
//   "Training Gear",
//   "Accessories",
// ];

export default function ShopPage() {
  // const [products, setProducts] = useState<Product[]>([]);
  // const [filtered, setFiltered] = useState<Product[]>([]);
  // const [search, setSearch] = useState("");
  // const [category, setCategory] = useState<string>("All Products");
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 6;
  // const { addToCart } = useCart();

  // useEffect(() => {
  //   getAllProducts().then((res) => {
  //     setProducts(res);
  //     setFiltered(res);
  //   });
  // }, []);

  // useEffect(() => {
  //   let result = products;

  //   if (category !== "All Products") {
  //     result = result.filter((p) =>
  //       p.name.toLowerCase().includes(category.toLowerCase())
  //     );
  //   }

  //   if (search.trim()) {
  //     result = result.filter((p) =>
  //       p.name.toLowerCase().includes(search.toLowerCase())
  //     );
  //   }

  //   setFiltered(result);
  //   setCurrentPage(1);
  // }, [search, category, products]);

  // // This function converts a Product object of type Product to a CartItem object of type CartItem.
  // const productToCartItem = (product: Product): CartItem => ({
  //   id: product.id,
  //   name: product.name,
  //   price: product.price,
  //   quantity: 1,
  //   image: product.image[0], // assuming the first image is the main one
  // });

  // const paginated = useMemo(() => {
  //   const start = (currentPage - 1) * itemsPerPage;
  //   return filtered.slice(start, start + itemsPerPage);
  // }, [filtered, currentPage]);

  // const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    // <main className="bg-primary-bg font-inter text-primary-text">
    //   <section className="py-16 text-center">
    //     <div className="container mx-auto px-4">
    //       <h1 className="font-poppins font-bold text-4xl md:text-5xl mb-6">
    //         Football Gear Shop
    //       </h1>
    //       <p className="text-primary-muted text-lg mb-8">
    //         Premium football equipment and gear curated for players at every
    //         level.
    //       </p>
    //       <div className="max-w-md mx-auto mb-2 relative">
    //         <input
    //           type="text"
    //           value={search}
    //           onChange={(e) => setSearch(e.target.value)}
    //           placeholder="Search products..."
    //           className="w-full bg-primary-card border border-divider rounded-lg px-4 py-3 pl-12 text-primary-text placeholder-primary-muted focus:border-accent-amber focus:outline-none"
    //         />
    //         <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-muted"></i>
    //       </div>
    //     </div>
    //   </section>

    //   {/* Categories */}
    //   <section className="pb-8">
    //     <div className="container mx-auto px-4">
    //       <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-4 mb-12">
    //         {CATEGORIES.map((cat) => (
    //           <span
    //             key={cat}
    //             onClick={() => setCategory(cat)}
    //             className={`${
    //               category === cat
    //                 ? "bg-accent-red text-white"
    //                 : "bg-primary-card border border-divider text-primary-text hover:text-accent-red"
    //             } px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors`}
    //           >
    //             {cat}
    //           </span>
    //         ))}
    //       </div>
    //     </div>
    //   </section>

    //   {/* Product Grid */}
    //   <section className="pb-16">
    //     <div className="container mx-auto px-4 max-w-6xl">
    //       {paginated && paginated.length > 0 ? (
    //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    //           {paginated.map((product) => (
    //             <div
    //               key={product.id}
    //               className="bg-primary-card rounded-xl border border-divider shadow-lg overflow-hidden hover:border-accent-red transition-colors"
    //             >
    //               <div className="relative h-64">
    //                 <Image
    //                   src={product.image[0]}
    //                   alt={product.name}
    //                   fill
    //                   className="object-cover"
    //                 />
    //               </div>
    //               <div className="p-6">
    //                 <h3 className="font-poppins font-semibold text-lg mb-2">
    //                   {product.name}
    //                 </h3>
    //                 <p className="text-primary-muted text-sm mb-4">
    //                   {product.description}
    //                 </p>
    //                 <div className="flex items-center justify-between mb-4">
    //                   <span className="text-accent-red font-bold text-xl">
    //                     ${product.price.toFixed(2)}
    //                   </span>
    //                 </div>
    //                 <button
    //                   className="w-full bg-accent-red hover:bg-opacity-90 text-white py-3 rounded-lg font-medium transition-colors"
    //                   onClick={() => addToCart(productToCartItem(product))}
    //                 >
    //                   Add to Cart
    //                 </button>
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       ) : (
    //         <div className="w-full flex flex-col items-center justify-center h-32">
    //           <h3 className="font-poppins font-semibold text-lg mb-2">
    //             No Product Found
    //           </h3>
    //         </div>
    //       )}

    //       {/* Pagination */}
    //       {totalPages > 1 && (
    //         <Pagination className="mt-12">
    //           <PaginationContent>
    //             <PaginationItem>
    //               <PaginationPrevious
    //                 onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
    //               />
    //             </PaginationItem>
    //             {Array.from({ length: totalPages }).map((_, i) => (
    //               <PaginationItem key={i}>
    //                 <PaginationLink
    //                   href="#"
    //                   isActive={currentPage === i + 1}
    //                   onClick={() => setCurrentPage(i + 1)}
    //                 >
    //                   {i + 1}
    //                 </PaginationLink>
    //               </PaginationItem>
    //             ))}
    //             <PaginationItem>
    //               <PaginationNext
    //                 onClick={() =>
    //                   setCurrentPage((p) => Math.min(p + 1, totalPages))
    //                 }
    //               />
    //             </PaginationItem>
    //           </PaginationContent>
    //         </Pagination>
    //       )}
    //     </div>
    //   </section>
    // </main>
    <div className="min-h-screen flex items-center justify-center"><h4 className="text-2xl font-bold">Coming Soon...</h4></div>
  );
}

// import React, {useEffect, useState} from "react";
// import {OrangeButton} from "../../components/OrangeButton/OrangeButton.tsx";
//
// export function SearchField(): React.JSX.Element {
//     const [categories, setCategories] = useState([])
//     const [selectedCategory, setSelectedCategory] = useState([])
//
//
//
//     const search = (e) => {
//         e.preventDefault()
//     }
//
//     useEffect(() => {
//         (async function () {
//             try {
//                 const response = await fetch("http://195.133.197.53:8081/categories", {
//                     method: "GET",
//                     credentials: "include"
//                 })
//                 let result = await response.json()
//                 setCategories(result)
//             } catch (error) {
//                 console.log(error)
//             }
//         })()
//     }, []);
//
//     const handleChange = (e) => {
//         setSelectedCategory(e.target.value)
//     }
//
//     return (
//         <form className={"search-container"}>
//             <select name="metroStation" className="search-input" value={selectedCategory} onChange={handleChange}>
//                 <option value="" disabled hidden>Поиск заданий по категориям</option>
//                 {categories && categories.map((category) => (
//                     <option key={category}>{category.name}</option>
//                 ))}
//             </select>
//             {/*<input type="text" className="search-input" placeholder="Поиск заданий по категориям"/>*/}
//             <div className={"search-button"}>
//                 <OrangeButton text={"Найти"} onClick={search}/>
//             </div>
//         </form>
//     )
// }

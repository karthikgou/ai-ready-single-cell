import {Outlet, NavLink,Link} from "react-router-dom"
import SearchBox from "../components/searchBar"
//import './style.css'; 

export default function RootLayout() {
    return(

        // <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-black HomePage inside-body" style={{overflow: "hidden"}}>
        //     <div className="flex min-h-screen flex-col">
        //         <div className="SVELTE_HYDRATER contents" dataprops="{&quot;isAuth&quot;:false,&quot;isWide&quot;:false}" datatarget="MainHeader">
        //             <header className="border-b border-gray-100">
        //                 <div className="w-full px-4 container flex h-16 items-center">
        //                     <div className="flex flex-1 items-center">
        //                         <a className="mr-5 flex flex-none items-center lg:mr-6">
        //                             {/* <img alt="OSCB Face's logo" class="w-7 md:mr-2" src="../assets/logo.png"/> */}
        //                             <span className="hidden whitespace-nowrap text-lg font-bold md:block"> OSCB</span>
        //                         </a>
        //                         <div className="relative flex-1 lg:max-w-sm mr-2 sm:mr-4 lg:mr-6  whitespace-nowrap">
        //                             <input autoComplete="off" className="w-full dark:bg-gray-950 pl-8 form-input-alt h-9 pr-3 focus:shadow-xl" name="" placeholder="Search models, datasets, users..." spellCheck="false" type="text"/>
        //                             <svg className="absolute left-2.5 text-gray-400 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
        //                                 <path d="M30 28.59L22.45 21A11 11 0 1 0 21 22.45L28.59 30zM5 14a9 9 0 1 1 9 9a9 9 0 0 1-9-9z" fill="currentColor"></path>    
        //                             </svg>   
        //                         </div>
        //                         <button className="relative flex w-8 flex-none items-center justify-center place-self-stretch lg:hidden" type="button">
        //                             <svg className="text-xl" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1.1em" height="1.1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
        //                                 <path d="M24 9.4L22.6 8L16 14.6L9.4 8L8 9.4l6.6 6.6L8 22.6L9.4 24l6.6-6.6l6.6 6.6l1.4-1.4l-6.6-6.6L24 9.4z" fill="currentColor"></path>
        //                             </svg>
        //                         </button>
        //                     </div>
        //                     <nav aria-label="Main" className="ml-auto hidden lg:block">
        //                         <ul className="flex items-center">
        //                             <li>
        //                                 <NavLink to="getStarted" className="group flex items-center py-0.5 dark:hover:text-gray-400 hover:text-indigo-700" >
        //                                     <svg className="mr-1 text-gray-400 group-hover:text-indigo-500" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
        //                                         <path className="uim-quaternary" d="M20.23 7.24L12 12L3.77 7.24a1.98 1.98 0 0 1 .7-.71L11 2.76c.62-.35 1.38-.35 2 0l6.53 3.77c.29.173.531.418.7.71z" opacity=".25" fill="currentColor"></path>
        //                                         <path className="uim-tertiary" d="M12 12v9.5a2.09 2.09 0 0 1-.91-.21L4.5 17.48a2.003 2.003 0 0 1-1-1.73v-7.5a2.06 2.06 0 0 1 .27-1.01L12 12z" opacity=".5" fill="currentColor"></path>
        //                                         <path className="uim-primary" d="M20.5 8.25v7.5a2.003 2.003 0 0 1-1 1.73l-6.62 3.82c-.275.13-.576.198-.88.2V12l8.23-4.76c.175.308.268.656.27 1.01z" fill="currentColor"></path>
        //                                     </svg>
        //                                     Get Started
        //                                 </NavLink>
        //                             </li>
        //                             <li>
        //                                 <NavLink to="updates" className="group flex items-center py-0.5 dark:hover:text-gray-400 hover:text-indigo-700">
        //                                     <svg className="mr-1 text-gray-400 group-hover:text-red-500" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 25 25">
        //                                         <ellipse cx="12.5" cy="5" fill="currentColor" fillOpacity="0.25" rx="7.5" ry="2"></ellipse>
        //                                         <path d="M12.5 15C16.6421 15 20 14.1046 20 13V20C20 21.1046 16.6421 22 12.5 22C8.35786 22 5 21.1046 5 20V13C5 14.1046 8.35786 15 12.5 15Z" fill="currentColor" opacity="0.5"></path>
        //                                         <path d="M12.5 7C16.6421 7 20 6.10457 20 5V11.5C20 12.6046 16.6421 13.5 12.5 13.5C8.35786 13.5 5 12.6046 5 11.5V5C5 6.10457 8.35786 7 12.5 7Z" fill="currentColor" opacity="0.5"></path>
        //                                         <path d="M5.23628 12C5.08204 12.1598 5 12.8273 5 13C5 14.1046 8.35786 15 12.5 15C16.6421 15 20 14.1046 20 13C20 12.8273 19.918 12.1598 19.7637 12C18.9311 12.8626 15.9947 13.5 12.5 13.5C9.0053 13.5 6.06886 12.8626 5.23628 12Z" fill="currentColor"></path>
        //                                     </svg>
        //                                     Updates
        //                                 </NavLink>
        //                             </li>
        //                             <li>
        //                                 <NavLink to="competitions" className="group flex items-center py-0.5 dark:hover:text-gray-400 hover:text-indigo-700">
        //                                     <svg className="mr-1 text-gray-400 group-hover:text-blue-500" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" viewBox="0 0 25 25">
        //                                         <path opacity=".5" d="M6.016 14.674v4.31h4.31v-4.31h-4.31ZM14.674 14.674v4.31h4.31v-4.31h-4.31ZM6.016 6.016v4.31h4.31v-4.31h-4.31Z" fill="currentColor"></path>
        //                                         <path opacity=".75" fillRule="evenodd" clipRule="evenodd" d="M3 4.914C3 3.857 3.857 3 4.914 3h6.514c.884 0 1.628.6 1.848 1.414a5.171 5.171 0 0 1 7.31 7.31c.815.22 1.414.964 1.414 1.848v6.514A1.914 1.914 0 0 1 20.086 22H4.914A1.914 1.914 0 0 1 3 20.086V4.914Zm3.016 1.102v4.31h4.31v-4.31h-4.31Zm0 12.968v-4.31h4.31v4.31h-4.31Zm8.658 0v-4.31h4.31v4.31h-4.31Zm0-10.813a2.155 2.155 0 1 1 4.31 0 2.155 2.155 0 0 1-4.31 0Z" fill="currentColor"></path>
        //                                         <path opacity=".25" d="M16.829 6.016a2.155 2.155 0 1 0 0 4.31 2.155 2.155 0 0 0 0-4.31Z" fill="currentColor"></path>
        //                                     </svg>
        //                                     Competitions
        //                                 </NavLink>
        //                             </li>
        //                             <li>
        //                                 <NavLink to="benchmarks" className="group flex items-center py-0.5 dark:hover:text-gray-400 hover:text-indigo-700">
        //                                     <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="mr-1 text-gray-400 group-hover:text-yellow-500" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
        //                                         <path opacity="0.5" d="M20.9022 5.10334L10.8012 10.8791L7.76318 9.11193C8.07741 8.56791 8.5256 8.11332 9.06512 7.7914L15.9336 3.73907C17.0868 3.08811 18.5002 3.26422 19.6534 3.91519L19.3859 3.73911C19.9253 4.06087 20.5879 4.56025 20.9022 5.10334Z" fill="currentColor"></path>
        //                                         <path d="M10.7999 10.8792V28.5483C10.2136 28.5475 9.63494 28.4139 9.10745 28.1578C8.5429 27.8312 8.074 27.3621 7.74761 26.7975C7.42122 26.2327 7.24878 25.5923 7.24756 24.9402V10.9908C7.25062 10.3319 7.42358 9.68487 7.74973 9.1123L10.7999 10.8792Z" fill="currentColor" fillOpacity="0.75"></path>
        //                                         <path fillRule="evenodd" clipRule="evenodd" d="M21.3368 10.8499V6.918C21.3331 6.25959 21.16 5.61234 20.8346 5.03949L10.7971 10.8727L10.8046 10.874L21.3368 10.8499Z" fill="currentColor"></path>
        //                                         <path opacity="0.5" d="M21.7937 10.8488L10.7825 10.8741V28.5486L21.7937 28.5234C23.3344 28.5234 24.5835 27.2743 24.5835 25.7335V13.6387C24.5835 12.0979 23.4365 11.1233 21.7937 10.8488Z" fill="currentColor"></path>
        //                                     </svg>
        //                                     Benchmarks
        //                                 </NavLink>
        //                             </li>
        //                             <li>
        //                                 <NavLink to="leaderboards" className="group flex items-center py-0.5 dark:hover:text-gray-400 hover:text-indigo-700">
        //                                     <svg className="text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
        //                                         <path className="uim-quaternary" d="M6 23H2a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1z" opacity=".25" fill="currentColor"></path>
        //                                         <path className="uim-primary" d="M14 23h-4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v20a1 1 0 0 1-1 1z" fill="currentColor"></path>
        //                                         <path className="uim-tertiary" d="M22 23h-4a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1z" opacity=".5" fill="currentColor"></path>
        //                                     </svg>
        //                                     Leaderboards
        //                                 </NavLink>
        //                             </li>
        //                             <li>
        //                                 <NavLink to="mydata" className="group flex items-center py-0.5 dark:hover:text-gray-400 hover:text-indigo-700">
        //                                     <svg className="text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
        //                                         <path className="uim-tertiary" d="M15.273 18.728A6.728 6.728 0 1 1 22 11.999V12a6.735 6.735 0 0 1-6.727 6.728z" opacity=".5" fill="currentColor"></path>
        //                                         <path className="uim-primary" d="M8.727 18.728A6.728 6.728 0 1 1 15.455 12a6.735 6.735 0 0 1-6.728 6.728z" fill="currentColor"></path>
        //                                     </svg>
        //                                     MyData
        //                                 </NavLink>
        //                             </li>
        //                             <li>
        //                                 <NavLink to="docs" className="group flex items-center py-0.5 dark:hover:text-gray-400 hover:text-indigo-700">
        //                                     <svg className="mr-1 text-gray-400 group-hover:text-red-500" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 25 25">
        //                                         <ellipse cx="12.5" cy="5" fill="currentColor" fillOpacity="0.25" rx="7.5" ry="2"></ellipse>
        //                                         <path d="M12.5 15C16.6421 15 20 14.1046 20 13V20C20 21.1046 16.6421 22 12.5 22C8.35786 22 5 21.1046 5 20V13C5 14.1046 8.35786 15 12.5 15Z" fill="currentColor" opacity="0.5"></path>
        //                                         <path d="M12.5 7C16.6421 7 20 6.10457 20 5V11.5C20 12.6046 16.6421 13.5 12.5 13.5C8.35786 13.5 5 12.6046 5 11.5V5C5 6.10457 8.35786 7 12.5 7Z" fill="currentColor" opacity="0.5"></path>
        //                                         <path d="M5.23628 12C5.08204 12.1598 5 12.8273 5 13C5 14.1046 8.35786 15 12.5 15C16.6421 15 20 14.1046 20 13C20 12.8273 19.918 12.1598 19.7637 12C18.9311 12.8626 15.9947 13.5 12.5 13.5C9.0053 13.5 6.06886 12.8626 5.23628 12Z" fill="currentColor"></path>
        //                                     </svg>
        //                                     Docs
        //                                 </NavLink>
        //                             </li>
        //                             <li>
        //                                 <NavLink to="team" className="group flex items-center py-0.5 dark:hover:text-gray-400 hover:text-indigo-700">
        //                                     <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="mr-1 text-gray-400 group-hover:text-yellow-500" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
        //                                         <path opacity="0.5" d="M20.9022 5.10334L10.8012 10.8791L7.76318 9.11193C8.07741 8.56791 8.5256 8.11332 9.06512 7.7914L15.9336 3.73907C17.0868 3.08811 18.5002 3.26422 19.6534 3.91519L19.3859 3.73911C19.9253 4.06087 20.5879 4.56025 20.9022 5.10334Z" fill="currentColor"></path>
        //                                         <path d="M10.7999 10.8792V28.5483C10.2136 28.5475 9.63494 28.4139 9.10745 28.1578C8.5429 27.8312 8.074 27.3621 7.74761 26.7975C7.42122 26.2327 7.24878 25.5923 7.24756 24.9402V10.9908C7.25062 10.3319 7.42358 9.68487 7.74973 9.1123L10.7999 10.8792Z" fill="currentColor" fillOpacity="0.75"></path>
        //                                         <path fillRule="evenodd" clipRule="evenodd" d="M21.3368 10.8499V6.918C21.3331 6.25959 21.16 5.61234 20.8346 5.03949L10.7971 10.8727L10.8046 10.874L21.3368 10.8499Z" fill="currentColor"></path>
        //                                         <path opacity="0.5" d="M21.7937 10.8488L10.7825 10.8741V28.5486L21.7937 28.5234C23.3344 28.5234 24.5835 27.2743 24.5835 25.7335V13.6387C24.5835 12.0979 23.4365 11.1233 21.7937 10.8488Z" fill="currentColor"></path>
        //                                     </svg>
        //                                     Teams
        //                                 </NavLink>
        //                             </li>
        //                             <li>
        //                                 <NavLink to="login" className="group flex items-center py-0.5 dark:hover:text-gray-400 hover:text-indigo-700">
        //                                     <svg className="mr-1 text-gray-400 group-hover:text-red-500" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 25 25">
        //                                         <ellipse cx="12.5" cy="5" fill="currentColor" fillOpacity="0.25" rx="7.5" ry="2"></ellipse>
        //                                         <path d="M12.5 15C16.6421 15 20 14.1046 20 13V20C20 21.1046 16.6421 22 12.5 22C8.35786 22 5 21.1046 5 20V13C5 14.1046 8.35786 15 12.5 15Z" fill="currentColor" opacity="0.5"></path>
        //                                         <path d="M12.5 7C16.6421 7 20 6.10457 20 5V11.5C20 12.6046 16.6421 13.5 12.5 13.5C8.35786 13.5 5 12.6046 5 11.5V5C5 6.10457 8.35786 7 12.5 7Z" fill="currentColor" opacity="0.5"></path>
        //                                         <path d="M5.23628 12C5.08204 12.1598 5 12.8273 5 13C5 14.1046 8.35786 15 12.5 15C16.6421 15 20 14.1046 20 13C20 12.8273 19.918 12.1598 19.7637 12C18.9311 12.8626 15.9947 13.5 12.5 13.5C9.0053 13.5 6.06886 12.8626 5.23628 12Z" fill="currentColor"></path>
        //                                     </svg>
        //                                     Login/SignUp
        //                                 </NavLink>
        //                             </li>
        //                         </ul>
        //                     </nav>   
                            
        //                 </div>
        //             </header>
        //         </div>
        //     </div>
        // </div>

        <div className="container">
            <div className ="header-container">
                <header>
                    <h1>OSCB</h1>
                    <div className="header-left">
                        <SearchBox />
                    </div>
                    <div className="header-right">
                        <nav>
                            <ul className="flex items-center">
                                <li>
                                    <NavLink to="getStarted" className="group flex items-center py-0.5 dark:hover:text-gray-400 hover:text-indigo-700 whitespace-nowrap" >
                                        <svg className="mr-1 text-gray-400 group-hover:text-indigo-500" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                            <path className="uim-quaternary" d="M20.23 7.24L12 12L3.77 7.24a1.98 1.98 0 0 1 .7-.71L11 2.76c.62-.35 1.38-.35 2 0l6.53 3.77c.29.173.531.418.7.71z" opacity=".25" fill="currentColor"></path>
                                            <path className="uim-tertiary" d="M12 12v9.5a2.09 2.09 0 0 1-.91-.21L4.5 17.48a2.003 2.003 0 0 1-1-1.73v-7.5a2.06 2.06 0 0 1 .27-1.01L12 12z" opacity=".5" fill="currentColor"></path>
                                            <path className="uim-primary" d="M20.5 8.25v7.5a2.003 2.003 0 0 1-1 1.73l-6.62 3.82c-.275.13-.576.198-.88.2V12l8.23-4.76c.175.308.268.656.27 1.01z" fill="currentColor"></path>
                                        </svg>
                                        Get Started
                                    </NavLink>
                                   </li>
                                 <li>
                                    <NavLink to="updates" className="group flex items-center py-0.5 dark:hover:text-gray-400 hover:text-indigo-700">
                                        <svg className="mr-1 text-gray-400 group-hover:text-red-500" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 25 25">
                                            <ellipse cx="12.5" cy="5" fill="currentColor" fillOpacity="0.25" rx="7.5" ry="2"></ellipse>
                                            <path d="M12.5 15C16.6421 15 20 14.1046 20 13V20C20 21.1046 16.6421 22 12.5 22C8.35786 22 5 21.1046 5 20V13C5 14.1046 8.35786 15 12.5 15Z" fill="currentColor" opacity="0.5"></path>
                                            <path d="M12.5 7C16.6421 7 20 6.10457 20 5V11.5C20 12.6046 16.6421 13.5 12.5 13.5C8.35786 13.5 5 12.6046 5 11.5V5C5 6.10457 8.35786 7 12.5 7Z" fill="currentColor" opacity="0.5"></path>
                                            <path d="M5.23628 12C5.08204 12.1598 5 12.8273 5 13C5 14.1046 8.35786 15 12.5 15C16.6421 15 20 14.1046 20 13C20 12.8273 19.918 12.1598 19.7637 12C18.9311 12.8626 15.9947 13.5 12.5 13.5C9.0053 13.5 6.06886 12.8626 5.23628 12Z" fill="currentColor"></path>
                                        </svg>
                                     Updates
                                    </NavLink>    
                                </li>
                                 <li>
                                    <NavLink to="competitions" className="group flex items-center py-0.5 dark:hover:text-gray-400 hover:text-indigo-700">
                                        <svg className="mr-1 text-gray-400 group-hover:text-blue-500" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" viewBox="0 0 25 25">
                                            <path opacity=".5" d="M6.016 14.674v4.31h4.31v-4.31h-4.31ZM14.674 14.674v4.31h4.31v-4.31h-4.31ZM6.016 6.016v4.31h4.31v-4.31h-4.31Z" fill="currentColor"></path>
                                            <path opacity=".75" fillRule="evenodd" clipRule="evenodd" d="M3 4.914C3 3.857 3.857 3 4.914 3h6.514c.884 0 1.628.6 1.848 1.414a5.171 5.171 0 0 1 7.31 7.31c.815.22 1.414.964 1.414 1.848v6.514A1.914 1.914 0 0 1 20.086 22H4.914A1.914 1.914 0 0 1 3 20.086V4.914Zm3.016 1.102v4.31h4.31v-4.31h-4.31Zm0 12.968v-4.31h4.31v4.31h-4.31Zm8.658 0v-4.31h4.31v4.31h-4.31Zm0-10.813a2.155 2.155 0 1 1 4.31 0 2.155 2.155 0 0 1-4.31 0Z" fill="currentColor"></path>
                                            <path opacity=".25" d="M16.829 6.016a2.155 2.155 0 1 0 0 4.31 2.155 2.155 0 0 0 0-4.31Z" fill="currentColor"></path>
                                        </svg>
                                        Competitions
                                    </NavLink>
                                 </li>
                                 <li>
                                    <NavLink to="benchmarks" className="group flex items-center py-0.5 dark:hover:text-gray-400 hover:text-indigo-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="mr-1 text-gray-400 group-hover:text-yellow-500" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                                            <path opacity="0.5" d="M20.9022 5.10334L10.8012 10.8791L7.76318 9.11193C8.07741 8.56791 8.5256 8.11332 9.06512 7.7914L15.9336 3.73907C17.0868 3.08811 18.5002 3.26422 19.6534 3.91519L19.3859 3.73911C19.9253 4.06087 20.5879 4.56025 20.9022 5.10334Z" fill="currentColor"></path>
                                            <path d="M10.7999 10.8792V28.5483C10.2136 28.5475 9.63494 28.4139 9.10745 28.1578C8.5429 27.8312 8.074 27.3621 7.74761 26.7975C7.42122 26.2327 7.24878 25.5923 7.24756 24.9402V10.9908C7.25062 10.3319 7.42358 9.68487 7.74973 9.1123L10.7999 10.8792Z" fill="currentColor" fillOpacity="0.75"></path>
                                            <path fillRule="evenodd" clipRule="evenodd" d="M21.3368 10.8499V6.918C21.3331 6.25959 21.16 5.61234 20.8346 5.03949L10.7971 10.8727L10.8046 10.874L21.3368 10.8499Z" fill="currentColor"></path>
                                            <path opacity="0.5" d="M21.7937 10.8488L10.7825 10.8741V28.5486L21.7937 28.5234C23.3344 28.5234 24.5835 27.2743 24.5835 25.7335V13.6387C24.5835 12.0979 23.4365 11.1233 21.7937 10.8488Z" fill="currentColor"></path>
                                        </svg>
                                        Benchmarks
                                    </NavLink>
                                 </li>
                                 <li>
                                    <NavLink to="leaderboards" className="group flex items-center py-0.5 dark:hover:text-gray-400 hover:text-indigo-700">
                                        <svg className="text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                            <path className="uim-quaternary" d="M6 23H2a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1z" opacity=".25" fill="currentColor"></path>
                                            <path className="uim-primary" d="M14 23h-4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v20a1 1 0 0 1-1 1z" fill="currentColor"></path>
                                            <path className="uim-tertiary" d="M22 23h-4a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1z" opacity=".5" fill="currentColor"></path>
                                        </svg>
                                        Leaderboards
                                    </NavLink>
                                 </li>
                                 <li>
                                    <NavLink to="mydata" className="group flex items-center py-0.5 dark:hover:text-gray-400 hover:text-indigo-700">
                                        <svg className="text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                            <path className="uim-tertiary" d="M15.273 18.728A6.728 6.728 0 1 1 22 11.999V12a6.735 6.735 0 0 1-6.727 6.728z" opacity=".5" fill="currentColor"></path>
                                            <path className="uim-primary" d="M8.727 18.728A6.728 6.728 0 1 1 15.455 12a6.735 6.735 0 0 1-6.728 6.728z" fill="currentColor"></path>
                                        </svg>
                                        MyData
                                    </NavLink>
                                 </li>
                                 <li>
                                    <NavLink to="docs" className="group flex items-center py-0.5 dark:hover:text-gray-400 hover:text-indigo-700">
                                        <svg className="mr-1 text-gray-400 group-hover:text-red-500" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 25 25">
                                            <ellipse cx="12.5" cy="5" fill="currentColor" fillOpacity="0.25" rx="7.5" ry="2"></ellipse>
                                            <path d="M12.5 15C16.6421 15 20 14.1046 20 13V20C20 21.1046 16.6421 22 12.5 22C8.35786 22 5 21.1046 5 20V13C5 14.1046 8.35786 15 12.5 15Z" fill="currentColor" opacity="0.5"></path>
                                            <path d="M12.5 7C16.6421 7 20 6.10457 20 5V11.5C20 12.6046 16.6421 13.5 12.5 13.5C8.35786 13.5 5 12.6046 5 11.5V5C5 6.10457 8.35786 7 12.5 7Z" fill="currentColor" opacity="0.5"></path>
                                            <path d="M5.23628 12C5.08204 12.1598 5 12.8273 5 13C5 14.1046 8.35786 15 12.5 15C16.6421 15 20 14.1046 20 13C20 12.8273 19.918 12.1598 19.7637 12C18.9311 12.8626 15.9947 13.5 12.5 13.5C9.0053 13.5 6.06886 12.8626 5.23628 12Z" fill="currentColor"></path>
                                        </svg>
                                        Docs
                                    </NavLink>
                                 </li>
                                 <li>
                                    <NavLink to="team" className="group flex items-center py-0.5 dark:hover:text-gray-400 hover:text-indigo-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="mr-1 text-gray-400 group-hover:text-yellow-500" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                                            <path opacity="0.5" d="M20.9022 5.10334L10.8012 10.8791L7.76318 9.11193C8.07741 8.56791 8.5256 8.11332 9.06512 7.7914L15.9336 3.73907C17.0868 3.08811 18.5002 3.26422 19.6534 3.91519L19.3859 3.73911C19.9253 4.06087 20.5879 4.56025 20.9022 5.10334Z" fill="currentColor"></path>
                                            <path d="M10.7999 10.8792V28.5483C10.2136 28.5475 9.63494 28.4139 9.10745 28.1578C8.5429 27.8312 8.074 27.3621 7.74761 26.7975C7.42122 26.2327 7.24878 25.5923 7.24756 24.9402V10.9908C7.25062 10.3319 7.42358 9.68487 7.74973 9.1123L10.7999 10.8792Z" fill="currentColor" fillOpacity="0.75"></path>
                                            <path fillRule="evenodd" clipRule="evenodd" d="M21.3368 10.8499V6.918C21.3331 6.25959 21.16 5.61234 20.8346 5.03949L10.7971 10.8727L10.8046 10.874L21.3368 10.8499Z" fill="currentColor"></path>
                                            <path opacity="0.5" d="M21.7937 10.8488L10.7825 10.8741V28.5486L21.7937 28.5234C23.3344 28.5234 24.5835 27.2743 24.5835 25.7335V13.6387C24.5835 12.0979 23.4365 11.1233 21.7937 10.8488Z" fill="currentColor"></path>
                                        </svg>
                                        Teams
                                    </NavLink>
                                 </li>
                                 <li>
                                    <NavLink to="login" className="group flex items-center py-0.5 dark:hover:text-gray-400 hover:text-indigo-700">
                                        <svg className="mr-1 text-gray-400 group-hover:text-red-500" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 25 25">
                                            <ellipse cx="12.5" cy="5" fill="currentColor" fillOpacity="0.25" rx="7.5" ry="2"></ellipse>
                                            <path d="M12.5 15C16.6421 15 20 14.1046 20 13V20C20 21.1046 16.6421 22 12.5 22C8.35786 22 5 21.1046 5 20V13C5 14.1046 8.35786 15 12.5 15Z" fill="currentColor" opacity="0.5"></path>
                                            <path d="M12.5 7C16.6421 7 20 6.10457 20 5V11.5C20 12.6046 16.6421 13.5 12.5 13.5C8.35786 13.5 5 12.6046 5 11.5V5C5 6.10457 8.35786 7 12.5 7Z" fill="currentColor" opacity="0.5"></path>
                                            <path d="M5.23628 12C5.08204 12.1598 5 12.8273 5 13C5 14.1046 8.35786 15 12.5 15C16.6421 15 20 14.1046 20 13C20 12.8273 19.918 12.1598 19.7637 12C18.9311 12.8626 15.9947 13.5 12.5 13.5C9.0053 13.5 6.06886 12.8626 5.23628 12Z" fill="currentColor"></path>
                                        </svg>
                                        Login/SignUp
                                    </NavLink>
                                 </li>
                             </ul>
                         </nav>
                     </div>
                 </header>
             </div>
             <div className="main-container">
                 <main>
                     <Outlet />
                 </main>
             </div>
         </div>

    )
}

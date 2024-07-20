import React from 'react'
import { Link , matchPath, useLocation} from 'react-router-dom'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import {NavbarLinks} from "../../data/navbar-links"
import { useState , useEffect} from 'react'
import { useSelector } from 'react-redux'
import {AiOutlineShoppingCart} from "react-icons/ai"
import {IoIosArrowDropdownCircle} from "react-icons/io"
import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/apis'


const subLinks = [
    {
        title: "Python",
        link:"/catalog/python"
    },
    {
        title: "Web Dev",
        link:"/catalog/web-development"
    },
];


const Navbar = () => {
    const {token} = useSelector( (state) => state.auth );
    const {user} = useSelector( (state) => state.profile );
    const {totalItems} = useSelector( (state) => state.cart )
    const location = useLocation()
    const [ssubLinks, setSsubLinks]  = useState([]);
    const matchRoute= (route)=>{
        return matchPath({path: route},location.pathname)
    }

    const fetchSublinks = async() => {
        try{
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            console.log("Printing Sublinks result:" , result);
            setSsubLinks(result.data.data);
        }
        catch(error) {
            console.log("Could not fetch the category list");
        }
    }


    useEffect( () => {
        console.log("PRINTING TOKEN", token);
        fetchSublinks();
    },[] )


  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
        <div className='w-11/12 flex max-w-maxContent items-center justify-evenly'>
            <Link to="/">
                <img src={logo} alt="" width={162} height={32}/>
            </Link>

            <nav>
                <ul className='flex text-richblack-25 gap-x-6'>
                    {
                        NavbarLinks.map((link, index) => {
                            return(
                                <li key={index}>
                                {
                                    link.title==="Catalog" ? (
                                        <div className='relative flex items-center gap-2 group'>
                                        <p>{link.title}</p>
                                        <IoIosArrowDropdownCircle/>
        
                                        <div className='invisible absolute left-[50%]
                                            translate-x-[-50%] translate-y-[30%] z-20
                                         top-[50%]
                                        flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900
                                        opacity-0 transition-all duration-200 group-hover:visible
                                        group-hover:opacity-100 lg:w-[300px]'>
        
                                        <div className='absolute left-[50%] top-0 z-10
                                        translate-x-[80%]
                                        translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-5'>
                                        </div>
        
                                        {
                                            subLinks.length ? (
                                                    subLinks.map( (subLink, index) => (
                                                        <Link to={`${subLink.link}`} key={index}>
                                                            <p>{subLink.title}</p>
                                                        </Link>
                                                    ) )
                                            ) : (<div></div>)
                                        }
        
                                        </div>
        
        
                                    </div>
                                    ) : (
                                        <Link to={link?.path}>
                                            <p className={`
                                                ${
                                                    matchRoute(link?.path) ? "text-yellow-25" : " text-richblack-700"
                                                }
                                                `}>{link?.title}</p> 
                                        </Link>
                                        )
                                }
                                </li>
                            )

                        })
                    }
                </ul>
            </nav>

            <div className='flex gap-x-4 items-center'>
            {
                user && user?.accountType != "Instructor" && (
                    <Link to="/dashboard/cart" className='relative'>
                        <AiOutlineShoppingCart />
                        {
                            totalItems > 0 && (
                                <span>
                                    {totalItems}
                                </span>
                            )
                        }
                    </Link>
                )
            }
            {
                token === null && (
                    <Link to="/login">
                        <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                            Log in
                        </button>
                    </Link>
                )
            }
            {
                token === null && (
                    <Link to="/signup">
                        <button  className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                            Sign Up
                        </button>
                    </Link>
                )
            }
            {
                token !== null && <div></div>
            }
            </div>
        </div>
      
    </div>
  )
}

export default Navbar

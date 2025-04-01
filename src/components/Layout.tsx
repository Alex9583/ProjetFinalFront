import type {ReactNode} from "react";
import Header from "./Header"
import Footer from "./Footer"

const Layout = ({children}: { children: ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header/>
            <div className="flex-grow p-5">
                {children}
            </div>
            <Footer/>
        </div>
    )
}

export default Layout
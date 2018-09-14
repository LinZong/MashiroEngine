import React from "react";
import "./NavBar.less";
function NavBar(props) {
    return (
        <nav class="NavBar">
            <div className="NavBarBrand">
                {props.brand &&
                    (props.brand instanceof Array ? (
                        props.brand.map(it => it && <div className="NavBarItem">{it}</div>)
                    ) : (
                            <div className="NavBarItem">{props.brand}</div>
                        ))}

                <div className="NavBarMenu">
                    {props.children instanceof Array ? (
                        props.children.map(it => it && <div className="NavBarItem">{it}</div>)
                    ) : (
                            <div className="NavBarItem">{props.children}</div>
                        )}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;

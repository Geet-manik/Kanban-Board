import React, { useState } from 'react';
import filterIcon from '../../assets/Tuning.svg';
import downIcon from '../../assets/Down.svg';

import styles from './Navbar.module.css'; 
function Navbar(props) {
    const [toggleFilter, setToggleFilter] = useState(false);

    function handleDisplayToggle(e) {
        setToggleFilter(!toggleFilter);
        if (e.target.value !== undefined) {
            props.handleGroupValue(e.target.value);
        }
    }
    function handleOrderingValue(e) {
        setToggleFilter(!toggleFilter);
        if (e.target.value !== undefined) {
            props.handleOrderValue(e.target.value);
        }
    }

    return (
        <>
            <div className={styles.navbar}>
                <div className={styles.navbarContainer}>
                    <div>
                        <div className={styles.displayButton} onClick={handleDisplayToggle}>
                            <div className={styles.iconWrapper + ' ' + styles.filterIcon}>
                                <img src={filterIcon} alt="Filter Icon" />
                            </div>
                            <div className={styles.displayText}>
                                Display
                            </div>
                            <div className={styles.iconWrapper + ' ' + styles.dropdownIcon}>
                                <img src={downIcon} alt="Dropdown Icon" />
                            </div>
                        </div>
                        <div className={toggleFilter ? styles.dropdownMenu + ' ' + styles.dropdownMenuVisible : styles.dropdownMenu}>
                            <div className={styles.filterSection}>
                                <div className={styles.filterCategory}>
                                    Grouping
                                </div>
                                <div className={styles.filterSelector}>
                                    <select value={props.groupValue} onChange={handleDisplayToggle} className={styles.selector} name="grouping" id="">
                                        <option value="status">Status</option>
                                        <option value="user">User</option>
                                        <option value="priority">Priority</option>
                                    </select>
                                </div>
                            </div>
                            <div className={styles.filterSection}>
                                <div className={styles.filterCategory}>
                                    Ordering
                                </div>
                                <div className={styles.filterSelector}>
                                    <select value={props.orderValue} onChange={handleOrderingValue} className={styles.selector} name="ordering" id="">
                                        <option value="priority">Priority</option>
                                        <option value="title">Title</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Navbar;
import React from 'react'
import Link from 'next/link'
import styles from '@styles/navbar.module.scss'

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>

                <div className={styles.logo}>
                    <Link href="/" className={styles.textLogo}>MySite</Link>
                </div>

                <div className={styles.nav_links}>

                    <Link href="/" className={styles.links}>Home</Link>

                </div>

                <div className={styles.authentications}>
                        <Link href="Signup" className={styles.signup}>Singup</Link>
                        <Link href="Signin" className={styles.signin}>Singin</Link>
                    </div>


            </div>
        </nav>
    )
}

export default Navbar

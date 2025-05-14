import React from 'react'
import styles from '@styles/loader.module.scss'

const Loader = () => {
  return (

    <div id='loader' className={styles.loader}>

        <div className={styles.bounce}>
            <span className={styles.text}>Loading...</span>
        </div>

    </div>
    
  )
}

export default Loader
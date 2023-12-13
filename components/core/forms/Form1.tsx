"use client";

import { useState } from "react";
import styles from "./Form1.module.scss";
import cls from "classnames";
const Form1 = ({ onSubmit }: { onSubmit?: (values: any) => void }) => {
   const [nameNote, setNameNote] = useState('');
   return <div className={styles.container}>
      <div className={styles.text}>
         Create a note
      </div>
      <form onSubmit={e => {
         onSubmit && onSubmit(nameNote);
         e.preventDefault();
      }} >
         <div className={styles.formRow}>
            <div className={styles.inputData}>
               <input type="text" onChange={e => setNameNote(e.target.value)} required />
               <div className={styles.underline}></div>
               <label htmlFor="">Name</label>
            </div>
            {/* <div className={styles.inputData}>
             <input type="text" required/>
             <div className={styles.underline}></div>
             <label htmlFor="">Last Name</label>
          </div> */}
         </div>
         {/* <div className={styles.formRow}>
          <div className={styles.inputData}>
             <input type="text" required/>
             <div className={styles.underline}></div>
             <label htmlFor="">Email Address</label>
          </div>
          <div className={styles.inputData}>
             <input type="text" required/>
             <div className={styles.underline}></div>
             <label htmlFor="">Website Name</label>
          </div>
       </div> */}
         <div className={styles.formRow} />
         <div className={cls(styles.inputData, styles.textarea)}>
            <div className={cls(styles.formRow, styles.submitBtn)}>
               <div className={styles.inputData}>
                  <div className={styles.inner}></div>
                  <input type="submit" value="submit" />
               </div>
            </div>
         </div>
      </form>
   </div>
}


export default Form1;

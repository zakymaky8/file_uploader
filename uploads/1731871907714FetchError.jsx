import PropTypes from "prop-types";

import styles from "../styles/Errors.module.css"

export default function FetchError({ message }) {
  return (
    <div className={styles.fetchError}>
      <h1>{message}</h1>
    </div>
  )
}


FetchError.propTypes = {
    message: PropTypes.string.isRequired,
  }

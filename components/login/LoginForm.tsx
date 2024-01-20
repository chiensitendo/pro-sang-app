import style from "./LoginForm.module.scss";

const LoginForm = () => {

    return <div className={style.LoginForm} id="login">
    <form>
      <h1>Sign In</h1>
      <input type="text" placeholder="Username"/>
      <input type="password" placeholder="Password"/>
      <button>Sign in</button>
    </form>
  </div>
}

export default LoginForm;
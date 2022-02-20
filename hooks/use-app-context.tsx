import { useContext } from "react"
import { AppContext, IAppContext } from "../context/AppContext"

export const UseAppContext = (): IAppContext => {
  const context = useContext(AppContext);
  return context as IAppContext;
}

import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

const LoginPage = () => {
  return (
    <div
      className="
    flex flex-col           
    w-full min-h-screen     
    items-center            
    gap-5              
    bg-white                
    overflow-hidden         
    "
    >
      <PageHeader title="사용자 정보 입력" />
    </div>
  );
};
export default LoginPage;

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
      <div className="flex flex-col items-stretch bg-white">
        {/* 이름 */}
        <div className="flex flex-col items-start justify-start gap-1">
          <div className="flex flex-row gap-2 overflow-hidden">
            <p className="text-xs font-semibold text-black">이름</p>
          </div>
          <div
            className="
              flex flex-row                 
              w-[361px] h-[44px]             
              items-center                   
              px-4 py-3                      
              rounded-lg                     
              bg-neutral-100                 
              border border-neutral-300      
              overflow-hidden                
            "
          ></div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;

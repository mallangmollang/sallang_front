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
      <div className="flex flex-col h-[852px] items-center gap-5 overflow-hidden bg-white">
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
        <div className="flex flex-col h-[86px] justify-start items-start gap-1">
          <div className="flex flex-row gap-[10px] justify-start items-start overflow-hidden">
            <p className="text-xs font-semibold text-black">성별</p>
          </div>
          <div className="flex flex-row w-[361px] h-[66px] items-center gap-1">
            <selectButton className="flex flex-row w-[174px] h-[55px] items-center px-4 py-1 overflow-hidden rounded-[12px] bg-orange-100 border-2 border-orange-500 border-solid">
              <p className="text-sm font-bold text-orange-500">남성</p>
            </selectButton>
            <selectButton className="flex flex-row w-[174px] h-[55px] items-center px-4 py-1 overflow-hidden rounded-[12px] bg-white border-2 border-neutral-300 border-solid">
              <p className="text-sm font-bold text-black">여성</p>
            </selectButton>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;

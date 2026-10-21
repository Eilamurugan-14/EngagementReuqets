import { toast } from "react-toastify";


export const showSuccessToast = (
  message
) => {
  toast.success(
  <div className="custom-toast">



    <div className="toast-content">
      <div className="toast-title">
        Success
      </div>

      <div className="toast-message">
        {message}
      </div>
    </div>

  </div>
);
};

export const showErrorToast = (
  message
) => {
  toast.error(
    <div className="custom-toast">
      <div className="toast-title">
        Error
      </div>

     

      <div className="toast-message">
        {message}
      </div>
    </div>
  );
};

export const showWarningToast = (
  message
) => {
  toast.warning(
    <div className="custom-toast">
      <div className="toast-title">
        Warning
      </div>

     

      <div className="toast-message">
        {message}
      </div>
    </div>
  );
};

export const showInfoToast = (
  message
) => {
  toast.info(
    <div className="custom-toast">
      <div className="toast-title">
        Information
      </div>

     

      <div className="toast-message">
        {message}
      </div>
    </div>
  );
};
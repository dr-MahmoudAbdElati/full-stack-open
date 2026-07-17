const Notification = ({ errMessage, setErrMessage }) => {
  if (errMessage === null) {
    return null;
  }
  const className = errMessage.includes("successfully") ? "success" : "error";
  setTimeout(() => {
    setErrMessage(null);
  }, 4000);

  return <div className={className}>{errMessage}</div>;
};

export default Notification;

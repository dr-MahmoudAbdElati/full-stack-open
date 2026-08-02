export default function Notification({ notification, setNotification }) {
  if (!notification) return null;

  setTimeout(() => {
    setNotification(null);
  }, 5000);

  const notificationStyle = {
    color: notification.type === "success" ? "green" : "red",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };
  return <div style={notificationStyle}>{notification.message}</div>;
}

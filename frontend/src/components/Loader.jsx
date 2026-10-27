export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-warning" role="status"></div>
      <div className="mt-2 text-muted">{text}</div>
    </div>
  );
}

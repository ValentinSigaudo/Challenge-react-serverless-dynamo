import { useNavigate } from "react-router-dom";

type Props = {
  msg: string;
  path: string;
};

const NavigateButton = ({ msg, path }: Props) => {
  const navigate = useNavigate();

  return (
    <button
      className="text-blue-500 hover:underline"
      onClick={() => navigate("/" + path)}
    >
      {msg}
    </button>
  );
};

export default NavigateButton;

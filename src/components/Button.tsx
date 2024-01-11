type Props = {
  value: string;
  disabled: boolean;
  type: "submit" | "reset" | "button" | undefined;
};

const Button = ({ value, disabled, type }: Props) => {
  return (
    <>
      <button
        className="self-center w-[50%] sm:w-[40%] p-1 text-white bg-slate-500 rounded drop-shadow-md"
        type={type}
        disabled={disabled}
      >
        {value}
      </button>
    </>
  );
};

export default Button;

type Props = {
  value: string;
  disabled: boolean | undefined;
  type: "submit" | "reset" | "button" | undefined;
  styles: string;
  onClick: () => {} | null;
};

const Button = ({ value, disabled, type, styles, onClick }: Props) => {
  return (
    <>
      <button
        className={
          styles ||
          "self-center w-[50%] sm:w-[40%] p-1 text-white bg-blue-500 rounded drop-shadow-md"
        }
        onClick={onClick}
        type={type}
        disabled={disabled}
      >
        {value}
      </button>
    </>
  );
};

export default Button;

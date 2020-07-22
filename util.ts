export const validateQueryData = (data: any) => {
  console.log(data, 'data');
  const keys = Object.keys(data);
  if (keys.length > 4) {
    return "provide no more than four arguments";
  }
  const hasName = keys.some((key) => key === "name");
  if (!hasName) {
    return "name field missing";
  }
  const hasEmail = keys.some((key) => key === "email");
  if (!hasEmail) {
    return "email field missing";
  } else {
    if (!validateEmail(data.email)) {
      return "given input for email is not in correct email format";
    }
  }
  const hasSubject = keys.some((key) => key === "subject");
  if (!hasSubject) {
    return "subject field missing";
  }
  const hasMessage = keys.some((key) => key === "message");
  if (!hasMessage) {
    return "message field missing";
  }
};

const validateEmail = (email: string) => {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
};

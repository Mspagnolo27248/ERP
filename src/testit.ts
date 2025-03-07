


export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };



    console.log(validateEmail("test.com"));
    console.log(validateEmail("@test.com"));
    console.log(validateEmail("test@test"));
    console.log(validateEmail("test@test.com"));
    console.log(validateEmail("test@test.com.au"));
    console.log(validateEmail("test@test.com.au.au"));
    console.log(validateEmail("test@test.com.au.au.au"));
    console.log(validateEmail("test@test.io"));


const otpGenerator = require('otp-generator')
export const generatorOTP = ()=>{
    const OTP = otpGenerator.generate(6, { upperCaseAlphabets: true, specialChars: true, digits:true,lowerCaseAlphabets:true  });
    return OTP
}
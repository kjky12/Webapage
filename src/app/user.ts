
//! 회원 가입 정보에 대한 구조체
export interface User {
    id: number;
    username: string;
    password: string;
    name: string;
    email: string;
    passwordConfirmation: string;
  }
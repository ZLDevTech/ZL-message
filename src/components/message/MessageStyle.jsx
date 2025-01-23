import styled from "styled-components";

export const container = styled.div``;

export const messageReference = styled.div`
  width: auto;
  background-color: #4e4e4e4d;
  padding: 0.5rem;
  border-left: 0.3rem solid green;
  font-size: 1.3rem;
  white-space: pre-wrap; /* Preserva quebras de linha e espaços */
  overflow-wrap: break-word; /* Quebra palavras longas */
`;

export const optionsMessages = styled.div`
  display: flex;
  justify-content: right;
  background-color: #efeae2;
  padding: 0.5rem;
  gap: 2rem;
`;

export const lineMessage = styled.div`
  margin: 1rem;
  display: flex;

  &.me {
    > div {
    -webkit-box-shadow: 0px 0px 60px -21px rgba(0,0,0,0.44);
    -moz-box-shadow: 0px 0px 60px -21px rgba(0,0,0,0.44);
    box-shadow: 0px 0px 60px -21px rgba(0,0,0,0.44);
      background-color: #d9fdd3;
      color: white;
    }
    justify-content: right;
  }
`;

export const contentMessage = styled.div`
  background-color: #fff;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  padding: 0.3rem, 0;
  max-width: 55%;
`;

export const message = styled.pre`
  color: black;
  font-size: 1.4rem;
  margin: 0.5rem 4rem 0.5rem 0.5rem;
  white-space: pre-wrap; /* Preserva quebras de linha e espaços */
  overflow-wrap: break-word; /* Quebra palavras longas */
`;

export const messageDate = styled.span`
  font-size: 1.1rem;
  color: #667781;
  text-align: right;
  height: 1.5rem;
  margin: 0.5rem 0.5rem 0;
  display: flex;
  justify-content: end;
  gap: 0.5rem;
`;

export const img_message = styled.pre`
  font-size: 1.5rem;
  white-space: pre-wrap; /* Preserva quebras de linha e espaços */
  overflow-wrap: break-word; /* Quebra palavras longas */
  gap: 1rem;
  display: flex;
  flex-direction: column;
`;

//Mobile

export const contentMessageMobile = styled.div`
  background-color: #fff;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  padding: 0.3rem;
  max-width: 85%;
`;

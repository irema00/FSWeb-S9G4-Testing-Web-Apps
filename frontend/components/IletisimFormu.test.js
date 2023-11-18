import React from "react";
import {
  getAllByLabelText,
  getByPlaceholderText,
  queryByPlaceholderText,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";
import { fireEvent } from "@testing-library/react";

test("hata olmadan render ediliyor", () => {
  render(<IletisimFormu />);
});

beforeEach(() => {
  render(<IletisimFormu />);
});

test("iletişim formu headerı render ediliyor", async () => {
  const header = screen.getByText(/İletişim Formu/i);
  expect(header).toBeInTheDocument;
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  const adInput = screen.getByPlaceholderText("İlhan");
  fireEvent.change(adInput, { target: { value: "İrem" } });
  await waitFor(() => {
    const hataMesaji = screen.queryAllByTestId("error");
    expect(hataMesaji).toHaveLength(1);
  });
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  fireEvent(screen.getByText("Gönder"), new MouseEvent("click"));
  await waitFor(() => {
    const hataMesaji = screen.queryAllByTestId("error");
    expect(hataMesaji).toHaveLength(3);
  });
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  const adInput = screen.getByPlaceholderText("İlhan");
  fireEvent.change(adInput, { target: { value: "Ahmet" } });
  const soyadInput = screen.getByPlaceholderText("Mansız");
  fireEvent.change(soyadInput, { target: { value: "Fırat" } });
  fireEvent(screen.getByText("Gönder"), new MouseEvent("click"));
  await waitFor(() => {
    const hataMesaji = screen.queryAllByTestId("error");
    expect(hataMesaji).toHaveLength(1);
  });
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  const mailInput = screen.getByLabelText("Email*");
  fireEvent.change(mailInput, { target: { value: "Ahmet" } });
  await waitFor(() => {
    const hataMesaji = screen.queryAllByTestId("error");
    expect(hataMesaji).toHaveLength(1);
    expect(hataMesaji[0]).toHaveTextContent(
      "email geçerli bir email adresi olmalıdır."
    );
  });
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  const adInput = screen.getByPlaceholderText("İlhan");
  fireEvent.change(adInput, { target: { value: "Ahmet" } });
  const mailInput = screen.getByLabelText("Email*");
  fireEvent.change(mailInput, { target: { value: "ahmet@gmail.com" } });
  fireEvent(screen.getByText("Gönder"), new MouseEvent("click"));
  await waitFor(() => {
    const hataMesaji = screen.queryAllByTestId("error");
    expect(hataMesaji[0]).toHaveTextContent("soyad gereklidir.");
  });
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  const adInput = screen.getByPlaceholderText("İlhan");
  fireEvent.change(adInput, { target: { value: "Ahmet" } });
  const soyadInput = screen.getByPlaceholderText("Mansız");
  fireEvent.change(soyadInput, { target: { value: "Fırat" } });
  const mailInput = screen.getByLabelText("Email*");
  fireEvent.change(mailInput, { target: { value: "ahmet@gmail.com" } });
  fireEvent(screen.getByText("Gönder"), new MouseEvent("click"));
  await waitFor(() => {
    const hataMesaji = screen.queryAllByTestId("error");
    expect(hataMesaji).toHaveLength(0);
  });
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  const adInput = screen.getByPlaceholderText("İlhan");
  fireEvent.change(adInput, { target: { value: "Ahmet" } });
  const soyadInput = screen.getByPlaceholderText("Mansız");
  fireEvent.change(soyadInput, { target: { value: "Fırat" } });
  const mailInput = screen.getByLabelText("Email*");
  fireEvent.change(mailInput, { target: { value: "ahmet@gmail.com" } });
  const mesajInput = screen.getByLabelText("Mesaj");
  fireEvent.change(mesajInput, { target: { value: "Test Mesajı" } });
  fireEvent(screen.getByText("Gönder"), new MouseEvent("click"));
  await waitFor(() => {
    const ad = screen.getByTestId("firstnameDisplay");
    const soyad = screen.getByTestId("lastnameDisplay");
    const email = screen.getByTestId("emailDisplay");
    const mesaj = screen.getByTestId("messageDisplay");

    expect(ad).toHaveTextContent("Ahmet");
    expect(soyad).toHaveTextContent("Fırat");
    expect(email).toHaveTextContent("ahmet@gmail.com");
    expect(mesaj).toHaveTextContent("Test Mesajı");
  });
});

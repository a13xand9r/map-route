import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import ReactDOM from 'react-dom';
import puppeteer, { Browser, Page } from 'puppeteer'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})


let browser: Browser
let page: Page
beforeAll(async () => {
  browser = await puppeteer.launch({})
  page = await browser.newPage()
  await page.goto('http://localhost:3000/')
})
afterAll(() => {
  browser.close()
})

test('point should be added', async () => {
  await page.click('input#newPointInput')
  await page.type('input#newPointInput', 'Paris')
  await page.click('input#newPointInput')
  await page.keyboard.press('Enter')
  await page.waitForResponse(() => true)

  const pointsList = await page.$$('.routePoints_routeItem__3p26C')
  const point = await page.$eval('.routePoints_routeItem__name__2IrVq', e => e.innerHTML)
  expect(pointsList.length).toBe(1)
  expect(point).toBe('Paris')
})


from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:8080")

    page.screenshot(path="jules-scratch/verification/login-page.png")

    page.get_by_label("Enter your username").fill("Jules")
    page.get_by_role("button", name="Join Chat").click()

    page.wait_for_selector("text=John Doe")

    page.screenshot(path="jules-scratch/verification/chat-page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

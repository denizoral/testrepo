from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)

    # Create two separate contexts for two users
    user1_context = browser.new_context()
    user2_context = browser.new_context()

    page1 = user1_context.new_page()
    page2 = user2_context.new_page()

    # User 1 (Jules) logs in
    page1.goto("http://localhost:8080")
    page1.get_by_label("Enter your username").fill("Jules")
    page1.get_by_role("button", name="Join Chat").click()

    # User 2 (Jane) logs in
    page2.goto("http://localhost:8080")
    page2.get_by_label("Enter your username").fill("Jane")
    page2.get_by_role("button", name="Join Chat").click()

    # In page1, Jules waits for Jane to appear and selects her
    page1.wait_for_selector("text=Jane", timeout=10000)
    page1.get_by_text("Jane").click()

    # Give a moment for animations and rendering
    page1.wait_for_timeout(500)

    # Take a screenshot of the final UI
    page1.screenshot(path="jules-scratch/verification/frosted-glass-ui.png")

    print("Screenshot taken successfully!")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)

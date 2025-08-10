from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)

    # Create two separate contexts for two users
    user1_context = browser.new_context()
    user2_context = browser.new_context()

    page1 = user1_context.new_page()
    page2 = user2_context.new_page()

    # --- User 1 (Jules) logs in ---
    page1.goto("http://localhost:8080")
    page1.get_by_label("Enter your username").fill("Jules")
    page1.get_by_role("button", name="Join Chat").click()

    # --- User 2 (Jane) logs in ---
    page2.goto("http://localhost:8080")
    page2.get_by_label("Enter your username").fill("Jane")
    page2.get_by_role("button", name="Join Chat").click()

    # --- In page2, Jane waits for Jules to appear and selects him ---
    page2.wait_for_selector("text=Jules", timeout=10000)
    page2.get_by_text("Jules").click()

    # --- In page1, Jules waits for Jane to appear and selects her ---
    page1.wait_for_selector("text=Jane", timeout=10000)
    page1.get_by_text("Jane").click()

    # --- Jules starts typing ---
    page1.get_by_placeholder("Type a message").fill("H")

    # --- In page2, Jane should see the "typing..." indicator ---
    # We locate the header/toolbar area and then find the "typing..." text within it.
    chat_header = page2.locator('header')
    expect(chat_header.get_by_text("typing...")).to_be_visible()

    print("Typing indicator appeared successfully!")

    # --- Take a screenshot of Jane's view ---
    page2.screenshot(path="jules-scratch/verification/typing-indicator-view.png")

    # --- Jules stops typing (by clearing the input) ---
    page1.get_by_placeholder("Type a message").fill("")

    # --- In page2, the "typing..." indicator should disappear ---
    expect(chat_header.get_by_text("typing...")).to_be_hidden()

    print("Typing indicator disappeared successfully!")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

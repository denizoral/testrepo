from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)

    # --- Helper function to print console logs ---
    def print_console_logs(page, user_name):
        def handle_console(msg):
            print(f"CONSOLE LOG ({user_name}): {msg.text}")
        page.on("console", handle_console)

    # --- Create two separate contexts for two users ---
    user1_context = browser.new_context()
    user2_context = browser.new_context()

    page1 = user1_context.new_page()
    page2 = user2_context.new_page()

    # --- Attach console log handlers ---
    print_console_logs(page1, "Jules")
    print_console_logs(page2, "Jane")

    # --- User 1 (Jules) logs in ---
    page1.goto("http://localhost:8080")
    page1.get_by_label("Enter your username").fill("Jules")
    page1.get_by_role("button", name="Join Chat").click()

    # --- User 2 (Jane) logs in ---
    page2.goto("http://localhost:8080")
    page2.get_by_label("Enter your username").fill("Jane")
    page2.get_by_role("button", name="Join Chat").click()

    # --- In page1, Jules waits for Jane to appear and selects her ---
    page1.wait_for_selector("text=Jane", timeout=10000)
    page1.get_by_text("Jane").click()

    # --- Jules sends a message to Jane ---
    page1.get_by_placeholder("Type a message").fill("Hello Jane!")
    page1.locator('button[type="submit"]').click()

    # --- In page2, Jane waits for Jules to appear and selects him ---
    page2.wait_for_selector("text=Jules", timeout=10000)
    page2.get_by_text("Jules").click()

    # --- Then, Jane waits for the message from Jules to be visible ---
    expect(page2.get_by_text("Hello Jane!")).to_be_visible()

    # --- Take screenshots ---
    page1.screenshot(path="jules-scratch/verification/jules-chat-view.png")
    page2.screenshot(path="jules-scratch/verification/jane-chat-view.png")

    print("Script completed successfully!")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)

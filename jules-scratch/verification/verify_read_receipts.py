from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
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

    # --- In page1, Jules waits for Jane to appear and selects her ---
    page1.wait_for_selector("text=Jane", timeout=10000)
    page1.get_by_text("Jane").click()

    # --- Jules sends a message to Jane ---
    page1.get_by_placeholder("Type a message").fill("Testing read receipts")
    page1.locator('button[type="submit"]').click()

    # --- Verify "delivered" status (two grey checks) ---
    delivered_icon = page1.locator('[data-testid="delivered-icon"]')
    expect(delivered_icon).to_be_visible(timeout=5000)
    print("'Delivered' status icon appeared successfully.")

    # --- In page2, Jane selects Jules, which should mark messages as "read" ---
    page2.wait_for_selector("text=Jules", timeout=10000)
    page2.get_by_text("Jules").click()

    # --- Verify "read" status (blue checks) on Jules's page ---
    read_icon = page1.locator('[data-testid="read-icon"]')
    expect(read_icon).to_be_visible(timeout=5000)
    print("'Read' status icon appeared successfully.")

    # --- Take a screenshot of Jules's view to verify the blue checks ---
    page1.screenshot(path="jules-scratch/verification/read-receipt-view.png")
    print("Screenshot taken for read receipt verification.")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

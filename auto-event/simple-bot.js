const axios = require("axios");
const fs = require("fs");
class SimpleGameBot {
  constructor() {
    this.baseURL = "https://psha.zoneplay.vn/g38";
    this.accessToken = null;
    this.authId = null;
    this.currentAccount = 0;
    this.csrfToken = null;
    this.cookies = null; // 🧠 Lưu cookie session + xsrf-token
  }
  async getCSRFToken() {
    try {
      const response = await axios.get("https://psha.zoneplay.vn/landing", {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      // Lấy cookie set-cookie từ header
      const setCookie = response.headers["set-cookie"];
      if (!setCookie) throw new Error("Không thấy cookie trong response");

      // Gộp tất cả cookie vào 1 string
      this.cookies = setCookie.map((c) => c.split(";")[0]).join("; ");

      // Tìm token trong meta
      const html = response.data;
      const csrfMatch = html.match(/<meta name="csrf-token" content="([^"]+)"/);
      if (csrfMatch) {
        this.csrfToken = csrfMatch[1];
        console.log(`🔑 CSRF Token: ${this.csrfToken.substring(0, 10)}...`);
      } else {
        console.log("❌ Không tìm thấy meta CSRF token");
      }

      console.log(`🍪 Cookie lấy được: ${this.cookies}`);
    } catch (error) {
      console.error("❌ Lỗi khi lấy CSRF token:", error.message);
    }
  }
  /**
   * Đăng nhập
   */
  async login(username, password) {
    try {
      console.log(`🔐 [${username}] Đăng nhập...`);
      await this.getCSRFToken();

      const response = await axios.post(
        `${this.baseURL}/login/zoneplay`,
        `username=${username}&password=${password}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "X-CSRF-TOKEN": this.csrfToken,
            Cookie: this.cookies, // 🧠 BẮT BUỘC: gửi session + xsrf token
          },
          withCredentials: true, // ⚙️ Cho axios gửi cookie
        }
      );

      const data = response.data;

      if (data.error_code !== 0) {
        console.log(
          `❌ [${username}] Login thất bại - Error: ${data.error_code}`
        );
        return false;
      }

      this.accessToken = data.access_token;
      this.authId = data.auth_id;

      console.log(
        `✅ [${username}] Login thành công - Auth ID: ${this.authId}`
      );
      return true;
    } catch (error) {
      console.error(`❌ [${username}] Lỗi login:`, error.message);
      return false;
    }
  }

  async register(username, password) {
    try {
      console.log(`📝 [${username}] Đăng ký tài khoản...`);

      const registerData = {
        username: username,
        password: password,
        repass: password,
        email: `${username}@gmail.com`,
        app_key: "2561e0097cc44fd571424f792fa35e48",
        rules: 1,
      };

      const response = await axios.post(
        "https://api-v3.zoneplay.vn/api/id/account/register",
        registerData,
        {
          headers: {
            "Content-Type": "application/json",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        }
      );

      const data = response.data;

      if (data.error_code === 0) {
        console.log(`✅ [${username}] Đăng ký thành công!`);
        return true;
      } else {
        console.log(
          `❌ [${username}] Đăng ký thất bại:`,
          data.message || data.error || "Lỗi không xác định"
        );
        return false;
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.log(
          `❌ [${username}] Đăng ký thất bại:`,
          error.response.data.message || error.response.data.error || "Lỗi API"
        );
      } else {
        console.error(`❌ [${username}] Lỗi đăng ký:`, error.message);
      }
      return false;
    }
  }

  /**
   * Tham gia events
   */
  async joinEvents() {
    const eventTypes = [2, 3, 4, 7, 12];

    for (const type of eventTypes) {
      try {
        console.log(`  📝 Event type ${type}...`);

        await axios.post(
          `${this.baseURL}/join-event`,
          `type=${type}&authId=${this.authId}`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${this.accessToken}`,
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              "X-CSRF-TOKEN": this.csrfToken,
              Cookie: this.cookies,
            },
            withCredentials: true,
          }
        );

        console.log(`  ✅ Event ${type} OK`);
        await this.sleep(200);
      } catch (error) {
        console.log(`  ❌ Event ${type} lỗi`);
      }
    }
  }

  /**
   * Chơi game 8 lần
   */
  async playGame(username) {
    let arrMessages = {
      username: username,
      messages: [],
    };
    for (let i = 1; i <= 8; i++) {
      try {
        console.log(`  🎲 Game ${i}/8...`);

        const response = await axios.post(
          `${this.baseURL}/play-game2`,
          `auth_id=${this.authId}&access_token=${this.accessToken}&shots=1`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${this.accessToken}`,
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              "X-CSRF-TOKEN": this.csrfToken,
              Cookie: this.cookies,
            },
            withCredentials: true,
          }
        );
        console.log(`  ✅ Game ${i} OK`);

        const data = response.data;
        if (data && data.message.includes("lịch sử")) {
          arrMessages.messages.push(data.message);
        }
        await this.sleep(0);
      } catch (error) {
        console.log(`  ❌ Game ${i} lỗi`);
      }
    }
    let winners = [];
    let accounts = [];
    const path = "./winners.json";
    const pathAccount = "./account.json";

    if (fs.existsSync(path)) {
      const existingData = fs.readFileSync(path, "utf-8");
      try {
        winners = JSON.parse(existingData);
      } catch {
        winners = [];
      }
    }

    // Thêm user mới nếu chưa có
    if (arrMessages.messages.length > 0) {
      winners.push(arrMessages);
    }
    accounts.push(username);

    // Ghi lại file JSON
    fs.writeFileSync(path, JSON.stringify(winners, null, 2), "utf-8");
    fs.writeFileSync(pathAccount, JSON.stringify(accounts, null, 2), "utf-8");

    console.log(
      `🎉 User ${arrMessages.username} có quà! Đã lưu vào winners.json`
    );
  }

  /**
   * Lấy lịch sử
   */
  async getHistory(username) {
    try {
      console.log(`📜 Lấy lịch sử cho ${username}...`);

      const response = await axios.post(
        `${this.baseURL}/history`,
        {
          access_token: this.accessToken,
          auth_id: this.authId,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${this.accessToken}`,
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "X-CSRF-TOKEN": this.csrfToken,
            Cookie: this.cookies,
          },
          withCredentials: true,
        }
      );

      console.log(`✅ History OK`);

      if (
        response.data &&
        (response.data.data?.gift?.length > 0 ||
          response.data.data?.rewards?.length > 0)
      ) {
        // Tạo object lưu thông tin user
        const userInfo = {
          username: username, // hoặc this.username, tuỳ bạn đặt
          time: new Date().toISOString(),
          gift: response.data.data?.gift || [],
          rewards: response.data.data?.rewards || [],
        };

        // Đọc file winners.json nếu có
        let winners = [];
        const path = "./winners.json";

        if (fs.existsSync(path)) {
          const existingData = fs.readFileSync(path, "utf-8");
          try {
            winners = JSON.parse(existingData);
          } catch {
            winners = [];
          }
        }

        // Thêm user mới nếu chưa có
        const exists = winners.find((u) => u.username === userInfo.username);
        if (!exists) {
          winners.push(userInfo);
        }

        // Ghi lại file JSON
        fs.writeFileSync(path, JSON.stringify(winners, null, 2), "utf-8");

        console.log(
          `🎉 User ${userInfo.username} có quà! Đã lưu vào winners.json`
        );
      }
      return response.data;
    } catch (error) {
      console.log(`❌ History lỗi`, error);
      return null;
    }
  }

  /**
   * Xử lý 1 tài khoản hoàn chỉnh
   */
  async processAccount(username, password) {
    console.log(`\n🚀 [${username}] Bắt đầu xử lý...`);

    // 0. Register
    console.log(`📝 [${username}] Đăng ký tài khoản...`);
    const registerSuccess = await this.register(username, password);
    if (!registerSuccess) {
      console.log(`⏭️ [${username}] Bỏ qua do đăng ký thất bại\n`);
      return false;
    }

    // 1. Login
    const loginSuccess = await this.login(username, password);
    if (!loginSuccess) {
      console.log(`⏭️ [${username}] Bỏ qua do login thất bại\n`);
      return false;
    }

    // 2. Join Events
    console.log(`🎮 [${username}] Tham gia events...`);
    await this.joinEvents();

    // 3. Play Game
    console.log(`🎯 [${username}] Chơi game...`);
    await this.playGame(username);

    // 4. Get History
    // console.log(`📜 [${username}] Lấy lịch sử...`);
    // await this.getHistory(username);

    console.log(`🎉 [${username}] Hoàn thành!\n`);
    return true;
  }

  /**
   * Tạo số điện thoại tiếp theo
   */
  generateNextPhone(basePhone) {
    const baseNumber = basePhone.slice(1); // Cắt bỏ chữ số đầu tiên
    const nextNumber = (
      BigInt(baseNumber) + BigInt(this.currentAccount)
    ).toString(); // Cộng vào phần còn lại
    return "0" + nextNumber; // Thêm '0' vào đầu số điện thoại
  }

  /**
   * Chạy vô hạn
   */
  async runForever(basePhone) {
    console.log(`🔄 Bắt đầu chạy vô hạn từ số: ${basePhone}\n`);

    while (true) {
      try {
        // Tạo số điện thoại hiện tại
        const currentPhone = this.generateNextPhone(basePhone);

        // Xử lý tài khoản
        await this.processAccount(currentPhone, currentPhone);

        // Tăng counter
        this.currentAccount++;

        // Nghỉ giữa các tài khoản
        console.log(`⏸️ Nghỉ 2 giây trước tài khoản tiếp theo...\n`);
        await this.sleep(500);
      } catch (error) {
        console.error(`💥 Lỗi không mong muốn:`, error.message);
        console.log(`🔄 Tiếp tục với tài khoản tiếp theo...\n`);
        this.currentAccount++;
        await this.sleep(1000);
      }
    }
  }

  /**
   * Sleep helper
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Main - Chạy ngay khi start file
async function main() {
  const BASE_PHONE = "0910267474"; // Thay số điện thoại của bạn ở đây
  console.log(`📱 Số điện thoại base: ${BASE_PHONE}`);
  const bot = new SimpleGameBot();
  await bot.runForever(BASE_PHONE);
}

// Chạy ngay
main().catch(console.error);

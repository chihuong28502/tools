const axios = require("axios");
const fs = require("fs");
const path = require("path");
class SimpleGameBot {
  constructor(basePhone) {
    this.basePhone = basePhone; // 🧠 Lưu lại biến basePhone
    this.baseURL = "https://psha.zoneplay.vn/g38";
    this.accessToken = null;
    this.authId = null;
    this.currentAccount = 0;
    this.csrfToken = null;
    this.cookies = null;
    // 🔧 Tạo thư mục log riêng theo basePhone
    this.logDir = path.join(__dirname, "logs", this.basePhone);
    fs.mkdirSync(this.logDir, { recursive: true });

    // 🔧 Đường dẫn file log riêng
    this.winnersPath = path.join(this.logDir, "winners.json");
    this.accountsPath = path.join(this.logDir, "account.json");
    this.codePath = path.join(this.logDir, "code.json");
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
      } catch (error) {
        console.log(`  ❌ Event ${type} lỗi`);
      }
    }
  }

  /**
   * Chơi game 8 lần
   */
  async playGame(username) {
    const arrMessages = {
      username,
      messages: [],
    };

    // --- chạy 8 game ---
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

        const data = response.data;
        if (data.error_code === 0) {
          const message = data.message;
          arrMessages.messages.push(message);
        }
      } catch (error) {
        console.log(`  ❌ Game ${i} lỗi`);
      }
    }
    console.log(`  🎯 Kết quả game:`, arrMessages);

    // --- đọc file winners & account ---
    const accountsPath = "./account.json";
    let accounts = [];

    if (fs.existsSync(this.accountsPath)) {
      try {
        accounts = JSON.parse(fs.readFileSync(this.accountsPath, "utf-8"));
      } catch {
        accounts = [];
      }
    }

    // --- lưu tất cả username đã chạy vào account.json ---
    if (!accounts.includes(username)) {
      accounts.push(username);
      fs.writeFileSync(
        this.accountsPath,
        JSON.stringify(accounts, null, 2),
        "utf-8"
      );
    }
  }

  async getHistory(username) {
    try {
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
          username: username,
          time: new Date().toISOString(),
          gift: response.data.data?.gift || [],
          rewards: response.data.data?.rewards || [],
        };

        // Đọc file winners.json nếu có
        let winners = [];
        if (fs.existsSync(this.winnersPath)) {
          const existingData = fs.readFileSync(this.winnersPath, "utf-8");
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
        fs.writeFileSync(
          this.winnersPath,
          JSON.stringify(winners, null, 2),
          "utf-8"
        );
      }
    } catch (error) {
      console.log(`❌ History lỗi`, error);
      return null;
    }
  }

  async getCodeFana(username) {
    try {
      const response = await axios.post(
        `${this.baseURL}/get-code`,
        {
          type: 8,
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
      console.log("🚀 ~ SimpleGameBot ~ getCodeFana ~ response:", response)

      // Tạo object lưu thông tin user
      const userInfo = {
        username: username,
        gift: response.data.code || [],
      };

      // Đọc file winners.json nếu có
      let codes = [];
      if (fs.existsSync(this.codePath)) {
        const existingData = fs.readFileSync(this.codePath, "utf-8");
        try {
          codes = JSON.parse(existingData);
        } catch {
          codes = [];
        }
      }

      // Thêm user mới nếu chưa có
      const exists = codes.find((u) => u.username === userInfo.username);
      if (!exists) {
        codes.push(userInfo);
      }
      fs.writeFileSync(this.codePath, JSON.stringify(codes, null, 2), "utf-8");
    } catch (error) {
      throw new Error(`❌ Lỗi lấy code: ${error.message}`);
    }
  }

  /**
   * Xử lý 1 tài khoản hoàn chỉnh
   */
  async processAccount(username, password) {
    console.log(`\n🚀 [${username}] Bắt đầu xử lý...`);

    // 0. Register
    // console.log(`📝 [${username}] Đăng ký tài khoản...`);
    // const registerSuccess = await this.register(username, password);
    // if (!registerSuccess) {
    //   console.log(`⏭️ [${username}] Bỏ qua do đăng ký thất bại\n`);
    //   return false;
    // }

    // 1. Login
    const loginSuccess = await this.login(username, password);
    if (!loginSuccess) {
      console.log(`⏭️ [${username}] Bỏ qua do login thất bại\n`);
      return false;
    }
    await this.getCodeFana(username);

    // // 2. Join Events
    // console.log(`🎮 [${username}] Tham gia events...`);
    // await this.joinEvents();

    // // 3. Play Game
    // console.log(`🎯 [${username}] Chơi game...`);
    // await this.playGame(username);
    // await this.sleep(500);

    // // 4. Get History
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
  /**
   * Chạy vô hạn (tiếp tục từ account cuối cùng nếu có)
   */
  async runForever(basePhone) {
    console.log(`🔄 Bắt đầu chạy vô hạn từ số: ${basePhone}\n`);

    // 🧩 Kiểm tra file account.json
    let lastPhone = null;
    if (fs.existsSync(this.accountsPath)) {
      try {
        const accounts = JSON.parse(
          fs.readFileSync(this.accountsPath, "utf-8")
        );
        if (Array.isArray(accounts) && accounts.length > 0) {
          lastPhone = accounts[accounts.length - 1];
          console.log(`📂 Đọc được account cuối: ${lastPhone}`);
        }
      } catch (err) {
        console.warn("⚠️ Không đọc được account.json:", err.message);
      }
    }

    // Nếu có lastPhone thì tính offset cho currentAccount
    if (lastPhone) {
      const baseNum = BigInt(basePhone.slice(1));
      const lastNum = BigInt(lastPhone.slice(1));
      const diff = lastNum - baseNum + BigInt(1); // +1 để tiếp tục số mới
      this.currentAccount = Number(diff);
      console.log(`➡️ Tiếp tục từ account tiếp theo (${this.currentAccount})`);
    } else {
      this.currentAccount = 0;
      console.log(`🆕 Chạy mới từ đầu số: ${basePhone}`);
    }

    // 🌀 Loop vô hạn
    while (true) {
      try {
        // Sinh số điện thoại hiện tại
        const currentPhone = this.generateNextPhone(basePhone);

        // Xử lý tài khoản
        await this.processAccount(currentPhone, currentPhone);

        // Tăng counter
        this.currentAccount++;

        // Nghỉ giữa các tài khoản
        console.log(`⏸️ Nghỉ 2 giây trước tài khoản tiếp theo...\n`);
        await this.sleep(200);
      } catch (error) {
        console.error(`💥 Lỗi không mong muốn:`, error.message);
        console.log(`🔄 Tiếp tục với tài khoản tiếp theo...\n`);
        this.currentAccount++;
        await this.sleep(1);
      }
    }
  }

  async runByArrBasePhone(basePhone) {
    console.log(`🔄 Bắt đầu chạy vô hạn từ số: ${basePhone}\n`);
    // 🧩 Kiểm tra file account.json
    let arrPhone = [];
    if (fs.existsSync(this.accountsPath)) {
      try {
        const accounts = JSON.parse(
          fs.readFileSync(this.accountsPath, "utf-8")
        );
        if (Array.isArray(accounts) && accounts.length > 0) {
          arrPhone = accounts
        }
      } catch (err) {
        console.warn("⚠️ Không đọc được account.json:", err.message);
      }
    }
    let index = 0 

    // 🌀 Loop vô hạn
    while (true) {
      try {
        const currentPhone = arrPhone[index];
        await this.processAccount(currentPhone, currentPhone);
        this.currentAccount++;
        await this.sleep(2000);
        index++;
      } catch (error) {
        console.error(`💥 Lỗi không mong muốn:`, error.message);
        console.log(`🔄 Tiếp tục với tài khoản tiếp theo...\n`);
      }
        await this.sleep(1000);
      }
  }

  /**
   * Sleep helper
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

async function main() {
  const BASE_PHONE = process.env.BASE_PHONE;
  console.log(`📱 Base phone: ${BASE_PHONE}`);
  const bot = new SimpleGameBot(BASE_PHONE);
  await bot.runByArrBasePhone(BASE_PHONE);
}

main().catch(console.error);

#!/bin/bash

# --- CÀI ĐẶT ---
DEVICE="127.0.0.1:5725"
# DEVICE="127.0.0.1:5555"
# --- KẾT THÚC CÀI ĐẶT ---

function runGiamDinh() {
    # --- VIỆC CỦA BẠN ---

    local CLICKGIAMDINH_X_PIXEL=1080 
    local CLICKGIAMDINH_Y_PIXEL=660 


    local CLICK1_X_PIXEL=471 
    local CLICK1_Y_PIXEL=272 

    local CLICK2_X_PIXEL=900 
    local CLICK2_Y_PIXEL=225 

    local CLICK3_X_PIXEL=500 
    local CLICK3_Y_PIXEL=600

    local CLICK4_X_PIXEL=900 
    local CLICK4_Y_PIXEL=600  

    local CLICK5_X_PIXEL=1300 
    local CLICK5_Y_PIXEL=600  

    local CLICKOUT_X_PIXEL=65 
    local CLICKOUT_Y_PIXEL=50  
    # --------------------

    echo "--- Bắt đầu hàm Giám định bằng 'tap' ---"

    for (( i=1; i<=150; i++ ))
    do
    adb -s $DEVICE shell input tap $CLICK1_X_PIXEL $CLICK1_Y_PIXEL
    sleep 2
    adb -s $DEVICE shell input tap $CLICK1_X_PIXEL $CLICK1_Y_PIXEL
    sleep 2
    adb -s $DEVICE shell input tap $CLICK1_X_PIXEL $CLICK1_Y_PIXEL
    sleep 2
    adb -s $DEVICE shell input tap $CLICKGIAMDINH_X_PIXEL $CLICKGIAMDINH_Y_PIXEL
    sleep 2

    adb -s $DEVICE shell input tap $CLICK2_X_PIXEL $CLICK2_Y_PIXEL
    sleep 2
    adb -s $DEVICE shell input tap $CLICK2_X_PIXEL $CLICK2_Y_PIXEL
    sleep 2
    adb -s $DEVICE shell input tap $CLICK2_X_PIXEL $CLICK2_Y_PIXEL
    sleep 2
    adb -s $DEVICE shell input tap $CLICKGIAMDINH_X_PIXEL $CLICKGIAMDINH_Y_PIXEL
    sleep 2

    adb -s $DEVICE shell input tap $CLICK3_X_PIXEL $CLICK3_Y_PIXEL
    sleep 2
    adb -s $DEVICE shell input tap $CLICK3_X_PIXEL $CLICK3_Y_PIXEL
    sleep 2
    adb -s $DEVICE shell input tap $CLICK3_X_PIXEL $CLICK3_Y_PIXEL
    sleep 2
    adb -s $DEVICE shell input tap $CLICKGIAMDINH_X_PIXEL $CLICKGIAMDINH_Y_PIXEL
    sleep 2

    adb -s $DEVICE shell input tap $CLICK4_X_PIXEL $CLICK4_Y_PIXEL
    sleep 2
    adb -s $DEVICE shell input tap $CLICK4_X_PIXEL $CLICK4_Y_PIXEL
    sleep 2
    adb -s $DEVICE shell input tap $CLICK4_X_PIXEL $CLICK4_Y_PIXEL
    sleep 2
    adb -s $DEVICE shell input tap $CLICKGIAMDINH_X_PIXEL $CLICKGIAMDINH_Y_PIXEL
    sleep 2

    adb -s $DEVICE shell input tap $CLICK5_X_PIXEL $CLICK5_Y_PIXEL
    sleep 2
    adb -s $DEVICE shell input tap $CLICK5_X_PIXEL $CLICK5_Y_PIXEL
    sleep 2
    adb -s $DEVICE shell input tap $CLICK5_X_PIXEL $CLICK5_Y_PIXEL
    sleep 2
    adb -s $DEVICE shell input tap $CLICKGIAMDINH_X_PIXEL $CLICKGIAMDINH_Y_PIXEL
    sleep 2
    echo "--- Kết thúc lần $i ---"
    sleep 590

    done
    echo "--- Kết thúc hàm 'chay_ai' ---"
}

function oanh_dau_truong(){

    local CLICKTHIDAU_X_PIXEL=1055 
    local CLICKTHIDAU_Y_PIXEL=860 

    local CLICKDAUTRUONG_X_PIXEL=300 
    local CLICKDAUTRUONG_Y_PIXEL=270 

    local CLICK1_X_PIXEL=1471 
    local CLICK1_Y_PIXEL=831

    local CLICK2_X_PIXEL=484 
    local CLICK2_Y_PIXEL=668

    local CLICK3_X_PIXEL=589 
    local CLICK3_Y_PIXEL=785

    
    local CLICKOUT_X_PIXEL=65 
    local CLICKOUT_Y_PIXEL=50 
    echo "--- Bắt đầu hàm 'oanh_dau_truong' bằng 'tap' ---"

    adb -s $DEVICE shell input tap $CLICKTHIDAU_X_PIXEL $CLICKTHIDAU_Y_PIXEL
    sleep 0.5
    adb -s $DEVICE shell input tap $CLICKDAUTRUONG_X_PIXEL $CLICKDAUTRUONG_Y_PIXEL
    sleep 0.5

       for (( i=1; i<=5; i++ ))
    do
    adb -s $DEVICE shell input tap $CLICK1_X_PIXEL $CLICK1_Y_PIXEL
    sleep 1
    adb -s $DEVICE shell input tap $CLICK2_X_PIXEL $CLICK2_Y_PIXEL
    sleep 0.5
    adb -s $DEVICE shell input tap $CLICK3_X_PIXEL $CLICK3_Y_PIXEL
    sleep 2
    echo "--- Kết thúc lần $((i+1)) ---"
    done
    adb -s $DEVICE shell input tap $CLICKOUT_X_PIXEL $CLICKOUT_Y_PIXEL
    sleep 0.3
    adb -s $DEVICE shell input tap $CLICKOUT_X_PIXEL $CLICKOUT_Y_PIXEL
    sleep 0.3
    echo "--- Kết thúc hàm 'oanh_dau_truong' ---"
}

function quet_khieuchienhangngay(){

    local CLICKKHIEUCHIEN_X_PIXEL=850 
    local CLICKKHIEUCHIEN_Y_PIXEL=850 

    local CLICKPHOBANNGAY_X_PIXEL=980 
    local CLICKPHOBANNGAY_Y_PIXEL=250 

    local CLICKQUET_X_PIXEL=1450 
    local CLICKQUET_Y_PIXEL=800

    local CLICKQUET_DONE_X_PIXEL=900 
    local CLICKQUET_DONE_Y_PIXEL=670

    local CLICKQUET_CONFIRM_KC_X_PIXEL=960 
    local CLICKQUET_CONFIRM_KC_Y_PIXEL=580
    
    local CLICKOUT_X_PIXEL=65 
    local CLICKOUT_Y_PIXEL=50 
    echo "--- Bắt đầu hàm 'quet_khieuchienhangngay'"

    adb -s $DEVICE shell input tap $CLICKKHIEUCHIEN_X_PIXEL $CLICKKHIEUCHIEN_Y_PIXEL
    sleep 0.5
    adb -s $DEVICE shell input tap $CLICKPHOBANNGAY_X_PIXEL $CLICKPHOBANNGAY_Y_PIXEL
    sleep 0.5

       for (( i=1; i<=1; i++ )) # free quét
    do
    adb -s $DEVICE shell input tap $CLICKQUET_X_PIXEL $CLICKQUET_Y_PIXEL
    sleep 0.5
    adb -s $DEVICE shell input tap $CLICKQUET_DONE_X_PIXEL $CLICKQUET_DONE_Y_PIXEL
    sleep 0.5
    adb -s $DEVICE shell input tap $CLICKQUET_DONE_X_PIXEL $CLICKQUET_DONE_Y_PIXEL
    sleep 0.5
    echo "--- Kết thúc lần $((i+1)) ---"
    done
    # ========================================

       for (( i=1; i<=3; i++ )) # quét mất phí
    do
    adb -s $DEVICE shell input tap $CLICKQUET_X_PIXEL $CLICKQUET_Y_PIXEL
    sleep 0.5
    adb -s $DEVICE shell input tap $CLICKQUET_CONFIRM_KC_X_PIXEL $CLICKQUET_CONFIRM_KC_Y_PIXEL
    sleep 0.5
    adb -s $DEVICE shell input tap $CLICKQUET_DONE_X_PIXEL $CLICKQUET_DONE_Y_PIXEL
    sleep 0.5
    echo "--- Kết thúc lần $((i+1)) ---"
    done
    
    adb -s $DEVICE shell input tap $CLICKOUT_X_PIXEL $CLICKOUT_Y_PIXEL
    sleep 0.3
    adb -s $DEVICE shell input tap $CLICKOUT_X_PIXEL $CLICKOUT_Y_PIXEL
    sleep 0.3
    echo "--- Kết thúc hàm 'quet_khieuchienhangngay' ---"
}

function ky_sy_doan(){

    local CLICKKYSYDOAN_X_PIXEL=1277 
    local CLICKKYSYDOAN_Y_PIXEL=861 

    local CLICK_KHUYEN_GOP_X_PIXEL=1187 
    local CLICK_KHUYEN_GOP_Y_PIXEL=655 

    local CLICK_GOP_X_PIXEL=300 
    local CLICK_GOP_Y_PIXEL=615 

    local CLICK_PHOBAN_X_PIXEL=1400 
    local CLICK_PHOBAN_Y_PIXEL=678 

    local CLICK_KHIEUCHIEN_X_PIXEL=1399 
    local CLICK_KHIEUCHIEN_Y_PIXEL=773 

    local CLICK_CHIEN_THANG_X_PIXEL=1065 
    local CLICK_CHIEN_THANG_Y_PIXEL=826 

    local CLICKQUET_X_PIXEL=1450 
    local CLICKQUET_Y_PIXEL=800

    local CLICKCONFIRMDH_X_PIXEL=1432 
    local CLICKCONFIRMDH_Y_PIXEL=840

    local CLICKQUET_CONFIRM_X_PIXEL=958 
    local CLICKQUET_CONFIRM_Y_PIXEL=585
    
    local CLICKOUT_X_PIXEL=65 
    local CLICKOUT_Y_PIXEL=50 
    echo "--- Bắt đầu hàm 'ky_sy_doan' bằng 'tap' ---"

    adb -s $DEVICE shell input tap $CLICKKYSYDOAN_X_PIXEL $CLICKKYSYDOAN_Y_PIXEL
    sleep 0.5
    adb -s $DEVICE shell input tap $CLICK_KHUYEN_GOP_X_PIXEL $CLICK_KHUYEN_GOP_Y_PIXEL
    sleep 0.5
     adb -s $DEVICE shell input tap $CLICK_GOP_X_PIXEL $CLICK_GOP_Y_PIXEL
    sleep 0.5
    adb -s $DEVICE shell input tap $CLICKOUT_X_PIXEL $CLICKOUT_Y_PIXEL
    sleep 0.3
    # adb -s $DEVICE shell input tap $CLICKOUT_X_PIXEL $CLICKOUT_Y_PIXEL
    # sleep 0.3
    adb -s $DEVICE shell input tap $CLICK_PHOBAN_X_PIXEL $CLICK_PHOBAN_Y_PIXEL
    sleep 0.3
    adb -s $DEVICE shell input tap $CLICK_KHIEUCHIEN_X_PIXEL $CLICK_KHIEUCHIEN_Y_PIXEL
    sleep 0.5
    adb -s $DEVICE shell input tap $CLICKCONFIRMDH_X_PIXEL $CLICKCONFIRMDH_Y_PIXEL
    sleep 0.5
    adb -s $DEVICE shell input tap $CLICK_KHIEUCHIEN_X_PIXEL $CLICK_KHIEUCHIEN_Y_PIXEL
    sleep 60
    adb -s $DEVICE shell input tap $CLICK_CHIEN_THANG_X_PIXEL $CLICK_CHIEN_THANG_Y_PIXEL
    sleep 0.5
        for (( i=1; i<=2; i++ ))
    do
    adb -s $DEVICE shell input tap $CLICKQUET_X_PIXEL $CLICKQUET_Y_PIXEL
    sleep 1
    adb -s $DEVICE shell input tap $CLICKQUET_CONFIRM_X_PIXEL $CLICKQUET_CONFIRM_Y_PIXEL
    sleep 0.5
    echo "--- Kết thúc lần $((i+1)) ---"
    done
    adb -s $DEVICE shell input tap $CLICKOUT_X_PIXEL $CLICKOUT_Y_PIXEL
    sleep 0.3
    adb -s $DEVICE shell input tap $CLICKOUT_X_PIXEL $CLICKOUT_Y_PIXEL
    echo "--- Kết thúc hàm 'ky_sy_doan' ---"
}

function ghep_dao_cu(){

    local CLICKGHEPDAOCU_X_PIXEL=820 
    local CLICKGHEPDAOCU_Y_PIXEL=456 

    local CLICKGHEPNHANH_X_PIXEL=360 
    local CLICKGHEPNHANH_Y_PIXEL=800 

    local CLICKXACNHAN_X_PIXEL=956 
    local CLICKXACNHAN_Y_PIXEL=618

    local CLICKDONE_X_PIXEL=805 
    local CLICKDONE_Y_PIXEL=676

    local CLICK_BAN_BE_X_PIXEL=128
    local CLICK_BAN_BE_Y_PIXEL=200

    local CLICK_TANG_NHANH_X_PIXEL=1200
    local CLICK_TANG_NHANH_Y_PIXEL=736
    
    local CLICKOUT_X_PIXEL=65 
    local CLICKOUT_Y_PIXEL=50 
    echo "--- Bắt đầu hàm 'ghep_dao_cu' bằng 'tap' ---"

    adb -s $DEVICE shell input tap $CLICKGHEPDAOCU_X_PIXEL $CLICKGHEPDAOCU_Y_PIXEL
    sleep 0.5
    adb -s $DEVICE shell input tap $CLICKGHEPNHANH_X_PIXEL $CLICKGHEPNHANH_Y_PIXEL
    sleep 0.5
    adb -s $DEVICE shell input tap $CLICKXACNHAN_X_PIXEL $CLICKXACNHAN_Y_PIXEL
    sleep 0.5
    adb -s $DEVICE shell input tap $CLICKDONE_X_PIXEL $CLICKDONE_Y_PIXEL
    sleep 0.3
    adb -s $DEVICE shell input tap $CLICKOUT_X_PIXEL $CLICKOUT_Y_PIXEL
    sleep 0.3
    adb -s $DEVICE shell input tap $CLICK_BAN_BE_X_PIXEL $CLICK_BAN_BE_Y_PIXEL
    sleep 0.3
    adb -s $DEVICE shell input tap $CLICK_TANG_NHANH_X_PIXEL $CLICK_TANG_NHANH_Y_PIXEL
    sleep 0.3
    adb -s $DEVICE shell input tap $CLICKOUT_X_PIXEL $CLICKOUT_Y_PIXEL
    sleep 0.3
    echo "--- Kết thúc hàm 'ghep_dao_cu' ---"
}

function ghep_dao_cu(){

    local CLICKGHEPDAOCU_X_PIXEL=820 
    local CLICKGHEPDAOCU_Y_PIXEL=456 

    local CLICKGHEPNHANH_X_PIXEL=360 
    local CLICKGHEPNHANH_Y_PIXEL=800 

    local CLICKXACNHAN_X_PIXEL=956 
    local CLICKXACNHAN_Y_PIXEL=618

    local CLICKDONE_X_PIXEL=805 
    local CLICKDONE_Y_PIXEL=676

    local CLICK_BAN_BE_X_PIXEL=128
    local CLICK_BAN_BE_Y_PIXEL=200

    local CLICK_TANG_NHANH_X_PIXEL=1200
    local CLICK_TANG_NHANH_Y_PIXEL=736
    
    local CLICKOUT_X_PIXEL=65 
    local CLICKOUT_Y_PIXEL=50 
    echo "--- Bắt đầu hàm 'ghep_dao_cu' bằng 'tap' ---"

    adb -s $DEVICE shell input tap $CLICKGHEPDAOCU_X_PIXEL $CLICKGHEPDAOCU_Y_PIXEL
    sleep 0.5
    adb -s $DEVICE shell input tap $CLICKGHEPNHANH_X_PIXEL $CLICKGHEPNHANH_Y_PIXEL
    sleep 0.5
    adb -s $DEVICE shell input tap $CLICKXACNHAN_X_PIXEL $CLICKXACNHAN_Y_PIXEL
    sleep 0.5
    adb -s $DEVICE shell input tap $CLICKDONE_X_PIXEL $CLICKDONE_Y_PIXEL
    sleep 0.3
    adb -s $DEVICE shell input tap $CLICKOUT_X_PIXEL $CLICKOUT_Y_PIXEL
    sleep 0.3
    adb -s $DEVICE shell input tap $CLICK_BAN_BE_X_PIXEL $CLICK_BAN_BE_Y_PIXEL
    sleep 0.3
    adb -s $DEVICE shell input tap $CLICK_TANG_NHANH_X_PIXEL $CLICK_TANG_NHANH_Y_PIXEL
    sleep 0.3
    adb -s $DEVICE shell input tap $CLICKOUT_X_PIXEL $CLICKOUT_Y_PIXEL
    sleep 0.3
    echo "--- Kết thúc hàm 'ghep_dao_cu' ---"
}
function runthuhoachmavuc() {
    # --- VIỆC CỦA BẠN ---


    local CLICKNHAN_X_PIXEL=1250 
    local CLICKNHAN_Y_PIXEL=700 

    local CLICK1_X_PIXEL=259 
    local CLICK1_Y_PIXEL=570 

    local CLICK2_X_PIXEL=446 
    local CLICK2_Y_PIXEL=426 

    local CLICK3_X_PIXEL=625 
    local CLICK3_Y_PIXEL=446

    local CLICKOUT_X_PIXEL=65 
    local CLICKOUT_Y_PIXEL=50  
    # --------------------

    echo "--- Bắt đầu hàm thu hoạch ma vực---"


    for (( i=1; i<=150; i++ ))
    do
    adb -s $DEVICE shell input tap $CLICK1_X_PIXEL $CLICK1_Y_PIXEL
    sleep 1
    adb -s $DEVICE shell input tap $CLICKNHAN_X_PIXEL $CLICKNHAN_Y_PIXEL
    sleep 1.5
    adb -s $DEVICE shell input tap $CLICKNHAN_X_PIXEL $CLICKNHAN_Y_PIXEL
    sleep 1

       adb -s $DEVICE shell input tap $CLICK2_X_PIXEL $CLICK2_Y_PIXEL
    sleep 1
    adb -s $DEVICE shell input tap $CLICKNHAN_X_PIXEL $CLICKNHAN_Y_PIXEL
    sleep 1.5
    adb -s $DEVICE shell input tap $CLICKNHAN_X_PIXEL $CLICKNHAN_Y_PIXEL
    sleep 1

       adb -s $DEVICE shell input tap $CLICK3_X_PIXEL $CLICK3_Y_PIXEL
    sleep 1
    adb -s $DEVICE shell input tap $CLICKNHAN_X_PIXEL $CLICKNHAN_Y_PIXEL
    sleep 1.5
    adb -s $DEVICE shell input tap $CLICKNHAN_X_PIXEL $CLICKNHAN_Y_PIXEL
    sleep 1


    echo "--- Kết thúc lần $i ---"
    sleep 65

    done
}

function autoCreateAcc(){
    echo "--- Bắt đầu hàm 'autoCreateAcc' ---"
    
    # Khởi tạo SĐT từ biến cấu hình
    local sdt_current_num=922939254

    # Bắt đầu vòng lặp vô hạn
    while true
    do
        # Ghép số 0 vào SĐT hiện tại để nhập
        local sdt_full="0${sdt_current_num}"
        
        echo "=========================================="
        echo "Bắt đầu tạo tài khoản với SĐT: $sdt_full"
        echo "=========================================="

        # 1. Click vao input phone (330, 240) và điền SĐT
        echo "  Click tại (330, 240) - Input SĐT"
        adb -s $DEVICE shell input tap 330 240
        sleep 3
        echo "  Nhập SĐT: $sdt_full"
        adb -s $DEVICE shell input text "$sdt_full"
        sleep 4

        # 2. Click vao nut dang ky (1) (1000, 400)
        echo "  Click tại (1000, 400) - Nút Đăng ký (1)"
        adb -s $DEVICE shell input tap 1000 400
        echo "  Đang chờ xử lý đăng ký (1)..."
        sleep 5 # Chờ 3 giây để xử lý

         # 3. Click vao input pass (500, 440) và điền Pass
        echo "  Click tại (500, 440) - Input Pass"
        adb -s $DEVICE shell input tap 500 440
        sleep 5
        echo "  Nhập Pass: $sdt_full"
        adb -s $DEVICE shell input text "$sdt_full"
        sleep 3

        # 4. Click vao nut dang ky (2) (800, 600) (Có thể là nút xác nhận)
        echo "  Click tại (800, 600) - Nút Đăng ký (2)"
        adb -s $DEVICE shell input tap 800 600
        echo "  Đang chờ xử lý đăng ký (2) và tải game..."
        sleep 7 # Chờ 5 giây để đăng nhập/tải game

        # 5. Click vao nut x bo banner (1308, 165)
        echo "  Click tại (1308, 165) - Nút X (Banner)"
        adb -s $DEVICE shell input tap 1308 165
        echo "  Đã bỏ qua banner."
        sleep 5 # Chờ 2 giây

        # 6. Click vao nut x doi tai khoan (1308, 165)
        echo "  Click tại (1308, 165) - Nút X (Đổi tài khoản)"
        adb -s $DEVICE shell input tap 1490 134
        echo "  Đã click đổi tài khoản."
        echo "  Đang chờ quay lại màn hình đăng nhập..."
        sleep 17 # Chờ 5 giây để quay lại màn hình đăng nhập

        # Tăng SĐT lên 1 cho vòng lặp tiếp theo
        sdt_current_num=$((sdt_current_num + 1))
        
        echo "--- Hoàn tất 1 tài khoản, chuẩn bị cho tài khoản tiếp theo ---"
    done

    echo "--- Kết thúc hàm 'autoCreateAcc' ---"
}

function main() {

  echo "--- Đang kết nối tới thiết bị $DEVICE ---"
  adb connect $DEVICE

    # echo "BẮT ĐẦU CHẠY ẢI___"
    #   chay_ai
    # sleep 1


    # echo "BẮT ĐẦU OÁNH ĐẤU TRƯỜNG 10 lần"
    #   oanh_dau_truong
    # sleep 1


    # echo "BẮT ĐẦU QUÉT KHIÊU CHIẾN HÀNG NGÀY 10 lần"
    #   quet_khieuchienhangngay
    # sleep 1

    # echo "Oánh kỵ sĩ đoàn"
    #   ky_sy_doan
    # sleep 1

    echo "Ghép thu hoạch ma vực"
      autoCreateAcc
    sleep 1

}

# Lệnh gọi thực thi hàm main
main
 echo "ĐÃ HOÀN THÀNH TẤT CẢ TOOLS"

@echo off
cd /d "%~dp0"
if not exist "faculty-photos" mkdir "faculty-photos"
set OK=0
set NG=0
echo.
echo ===== 下載 GMBA 21 位師資照片 =====
echo.
echo [01/21] 陳鶴元  01-chen-ho-yuan.png
curl -sS -L --fail -m 60 -o "faculty-photos\01-chen-ho-yuan.png" "https://educator.thu.edu.tw/upload/educator/teacher_upload/00082-1746148839.png" && set /a OK+=1 || set /a NG+=1
echo [02/21] 金泰星  02-kim-brian.png
curl -sS -L --fail -m 60 -o "faculty-photos\02-kim-brian.png" "https://gmba.thu.edu.tw/upload/gmba/teacher_upload/00033-1763528128.png" && set /a OK+=1 || set /a NG+=1
echo [03/21] 黃尹姿  03-huang-yin-tzu.png
curl -sS -L --fail -m 60 -o "faculty-photos\03-huang-yin-tzu.png" "https://gmba.thu.edu.tw/upload/gmba/teacher_upload/00042-1708046565.png" && set /a OK+=1 || set /a NG+=1
echo [04/21] 黃家俊  04-wong-ka-chun.png
curl -sS -L --fail -m 60 -o "faculty-photos\04-wong-ka-chun.png" "https://stat.thu.edu.tw/upload/stat/teacher_upload/00058-1753844632.png" && set /a OK+=1 || set /a NG+=1
echo [05/21] 張永和  05-chang-yung-ho.jpg
curl -sS -L --fail -m 60 -o "faculty-photos\05-chang-yung-ho.jpg" "https://gmba.thu.edu.tw/upload/gmba/teacher_upload/%%E5%%BC%%B5%%E6%%B0%%B8%%E5%%92%%8C%%E8%%80%%81%%E5%%B8%%AB.jpg" && set /a OK+=1 || set /a NG+=1
echo [06/21] 郭一棟  06-kuo-i-doun.png
curl -sS -L --fail -m 60 -o "faculty-photos\06-kuo-i-doun.png" "https://fin.thu.edu.tw/upload/teacher_upload/00023-1698288885.png" && set /a OK+=1 || set /a NG+=1
echo [07/21] 莊凱旭  07-chuang-kai-shi.png
curl -sS -L --fail -m 60 -o "faculty-photos\07-chuang-kai-shi.png" "https://fin.thu.edu.tw/upload/teacher_upload/00015-1698289165.png" && set /a OK+=1 || set /a NG+=1
echo [08/21] 傅郁芬  08-fu-yufen.jpg
curl -sS -L --fail -m 60 -o "faculty-photos\08-fu-yufen.jpg" "https://gmba.thu.edu.tw/upload/gmba/teacher_upload/%%E5%%82%%85%%E9%%83%%81%%E8%%8A%%AC%%E8%%80%%81%%E5%%B8%%AB.jpg" && set /a OK+=1 || set /a NG+=1
echo [09/21] 黃琛瑞  09-huang-chen-jui.jpg
curl -sS -L --fail -m 60 -o "faculty-photos\09-huang-chen-jui.jpg" "https://gmba.thu.edu.tw/upload/gmba/teacher_upload/%%E9%%BB%%83%%E7%%90%%9B%%E7%%91%%9E%%E8%%80%%81%%E5%%B8%%AB.jpg" && set /a OK+=1 || set /a NG+=1
echo [10/21] 李貴宜  10-lee-kuei-i.jpg
curl -sS -L --fail -m 60 -o "faculty-photos\10-lee-kuei-i.jpg" "https://thotel.thu.edu.tw/wp-content/uploads/20120430093805902-scaled.jpg" && set /a OK+=1 || set /a NG+=1
echo [11/21] 吳祉芸  11-wu-chih-yun.jpg
curl -sS -L --fail -m 60 -o "faculty-photos\11-wu-chih-yun.jpg" "https://gmba.thu.edu.tw/upload/gmba/teacher_upload/%%E5%%90%%B3%%E8%%8A%%B7%%E8%%8A%%B8.jpg" && set /a OK+=1 || set /a NG+=1
echo [12/21] 陳靜瑜  12-chen-amy.jpg
curl -sS -L --fail -m 60 -o "faculty-photos\12-chen-amy.jpg" "https://gmba.thu.edu.tw/upload/gmba/teacher_upload/%%E9%%99%%B3%%E9%%9D%%9C%%E6%%84%%89.jpg" && set /a OK+=1 || set /a NG+=1
echo [13/21] 張譽騰  13-jang-jacky.jpg
curl -sS -L --fail -m 60 -o "faculty-photos\13-jang-jacky.jpg" "https://gmba.thu.edu.tw/upload/gmba/teacher_upload/%%E5%%BC%%B5%%E8%%AD%%BD%%E9%%A8%%B0.jpg" && set /a OK+=1 || set /a NG+=1
echo [14/21] 陳暐婷  14-chen-wei-ting.jpg
curl -sS -L --fail -m 60 -o "faculty-photos\14-chen-wei-ting.jpg" "https://inttrade.thu.edu.tw/wp-content/uploads/%%E9%%99%%B3%%E6%%9A%%90%%E5%%A9%%B7_%%E5%%B7%%A5%%E4%%BD%%9C%%E5%%8D%%80%%E5%%9F%%9F-1.jpg" && set /a OK+=1 || set /a NG+=1
echo [15/21] 莊旻潔  15-chuang-min-chieh.jpg
curl -sS -L --fail -m 60 -o "faculty-photos\15-chuang-min-chieh.jpg" "https://gmba.thu.edu.tw/upload/gmba/teacher_upload/%%E8%%8E%%8A%%E6%%97%%BB%%E6%%BD%%94.jpg" && set /a OK+=1 || set /a NG+=1
echo [16/21] 陳秋政  16-chen-jose.png
curl -sS -L --fail -m 60 -o "faculty-photos\16-chen-jose.png" "https://pmp.thu.edu.tw/upload/pmp/teacher_upload/00004-1742876754.png" && set /a OK+=1 || set /a NG+=1
echo [17/21] 林子立  17-lin-tzu-li.png
curl -sS -L --fail -m 60 -o "faculty-photos\17-lin-tzu-li.png" "https://politics.thu.edu.tw/upload/politics/teacher_upload/00011-1679276221.png" && set /a OK+=1 || set /a NG+=1
echo [18/21] 陳蔚芳  18-chen-wei-fang.png
curl -sS -L --fail -m 60 -o "faculty-photos\18-chen-wei-fang.png" "https://politics.thu.edu.tw/upload/politics/teacher_upload/00012-1712479736.png" && set /a OK+=1 || set /a NG+=1
echo [19/21] 張凱鑫  19-chang-kai-hsin.png
curl -sS -L --fail -m 60 -o "faculty-photos\19-chang-kai-hsin.png" "https://law.thu.edu.tw/upload/law/teacher_upload/00040-1696229749.png" && set /a OK+=1 || set /a NG+=1
echo [20/21] 邱嘉慧  20-chiu-chia-hui.jpg
curl -sS -L --fail -m 60 -o "faculty-photos\20-chiu-chia-hui.jpg" "https://flld.thu.edu.tw/wp-content/uploads/Chiu-Chia-Hui.jpg" && set /a OK+=1 || set /a NG+=1
echo [21/21] 白恒旭  21-bai-heng-xu.png
curl -sS -L --fail -m 60 -o "faculty-photos\21-bai-heng-xu.png" "https://ic.thu.edu.tw/upload/people_upload/00223-1661308358.png" && set /a OK+=1 || set /a NG+=1
echo.
echo ===== 完成：成功 %OK% 張，失敗 %NG% 張 =====
echo 檔案位置：%~dp0faculty-photos
echo.
dir /b "faculty-photos"
echo.
pause

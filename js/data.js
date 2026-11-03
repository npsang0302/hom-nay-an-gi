/*
 * TỪ ĐIỂN MÓN ĂN MIỀN BẮC
 * Mỗi dòng: Tên | nguyên liệu phân cách dấu phẩy | phương pháp | phút | thẻ tùy chọn
 * Muốn bổ sung món: thêm một dòng vào nhóm phù hợp. Không cần sửa thuật toán.
 * Các món lẩu / nhúng / nướng được tách thành các vai trò để ghép thực đơn đúng cách.
 */

export const MEAL_MODES = Object.freeze({
  family: { label: 'Cơm bình dân', emoji: '🍚', description: 'Đậm vị cơm nhà, quen thuộc mỗi ngày' },
  special: { label: 'Bữa cải thiện', emoji: '✨', description: 'Thịnh soạn hơn cho ngày đặc biệt' },
  nhau: { label: 'Bữa ăn nhậu', emoji: '🥢', description: 'Món ngon cho buổi tụ họp' },
  quick: { label: 'Bữa ăn nhanh', emoji: '⚡', description: 'Gọn nhẹ cho ngày bận rộn' }
});

export const ROLE_LABELS = Object.freeze({
  staple: 'Tinh bột', main: 'Món mặn chính', secondary: 'Món phụ',
  vegetable: 'Món rau', soup: 'Món canh', side: 'Ăn kèm',
  hotpot: 'Lẩu chính', dippingVeg: 'Rau / nấm nhúng',
  dippingProtein: 'Đồ nhúng', barbecue: 'Món nướng', appetizer: 'Khai vị'
});

const sections = [
  {
    group: 'pork-beef', role: 'main', emoji: '🍖',
    rows: `
Thịt ba chỉ rang cháy cạnh|thịt ba chỉ,hành tím,nước mắm|rang|25|everyday
Thịt lợn kho trứng cút|thịt lợn,trứng cút,nước mắm|kho|50|everyday
Thịt lợn kho tiêu|thịt lợn,tiêu,nước mắm|kho|40|everyday
Thịt lợn kho riềng|thịt lợn,riềng,nước mắm|kho|50|everyday
Thịt nạc vai rim mắm|thịt lợn,nước mắm,hành tím|rim|25|everyday
Thịt ba chỉ luộc|thịt ba chỉ,gừng,muối|luộc|30|everyday
Thịt chân giò luộc|chân giò,gừng,muối|luộc|60|weekend
Thịt chân giò giả cầy|chân giò,riềng,mẻ,mắm tôm|hầm|85|weekend
Thịt đông kiểu Bắc|thịt chân giò,bì lợn,mộc nhĩ,nước mắm|ninh|100|weekend
Thịt lợn xào hành tây|thịt lợn,hành tây,nước mắm|xào|20|quick
Thịt lợn xào sả ớt|thịt lợn,sả,ớt,nước mắm|xào|25|nhau
Thịt lợn xào nấm hương|thịt lợn,nấm hương,hành lá|xào|25|everyday
Thịt lợn xào dưa chua|thịt lợn,dưa cải chua,cà chua|xào|25|everyday
Thịt băm rang hành|thịt lợn,hành khô,nước mắm|rang|15|quick
Thịt băm chưng mắm tép|thịt lợn,mắm tép,riềng|chưng|35|everyday
Thịt băm sốt cà chua|thịt lợn,cà chua,hành lá|sốt|20|quick
Thịt viên sốt cà chua|thịt lợn,cà chua,hành tím|sốt|30|everyday
Thịt viên hấp nấm|thịt lợn,nấm hương,mộc nhĩ|hấp|35|everyday
Thịt cuộn lá lốt|thịt lợn,lá lốt,hành khô|rán|35|weekend
Chả lá lốt rán|thịt lợn,lá lốt,nước mắm|rán|30|everyday,nhau
Chả cốm Hà Nội|thịt lợn,cốm,trứng,nước mắm|rán|40|weekend
Chả quế áp chảo|thịt lợn,bột quế,nước mắm|áp chảo|35|weekend
Sườn xào chua ngọt|sườn lợn,cà chua,dấm,đường|xào|45|weekend
Sườn rim nước mắm|sườn lợn,nước mắm,hành khô|rim|40|everyday
Sườn kho dưa cải|sườn lợn,dưa cải chua,hành tím|kho|50|everyday
Sườn non hấp sả|sườn non,sả,gừng|hấp|45|weekend
Sườn lợn nướng mật ong|sườn lợn,mật ong,tỏi|nướng|60|nhau,weekend
Sườn sụn rang muối|sườn sụn,bột gạo rang,muối|rang|45|nhau
Ba chỉ lắc sả tắc|thịt ba chỉ,sả,quất,ớt|trộn|30|nhau
Ba chỉ cuộn nấm kim châm|thịt ba chỉ,nấm kim châm,hành lá|áp chảo|30|weekend
Thịt lợn hấp gừng|thịt lợn,gừng,hành lá|hấp|30|everyday
Thịt lợn nướng riềng mẻ|thịt lợn,riềng,mẻ,nước mắm|nướng|55|nhau
Lòng non luộc gừng|lòng lợn,gừng,rau thơm|luộc|35|nhau
Dồi lợn rán|dồi lợn,rau răm|rán|40|nhau
Gan lợn xào giá|gan lợn,giá đỗ,hành lá|xào|20|everyday
Tim lợn xào cần tỏi|tim lợn,cần tây,tỏi|xào|25|nhau
Tai heo luộc cuốn lá sung|tai heo,lá sung,gừng|luộc|45|nhau
Nem tai thính|tai heo,thính gạo,lá chanh|trộn|45|nhau
Bắp bò luộc gừng|bắp bò,gừng,sả|luộc|65|weekend,nhau
Bò xào cần tỏi|thịt bò,cần tây,tỏi|xào|20|quick
Bò xào hành tây|thịt bò,hành tây,tỏi|xào|20|quick
Bò xào súp lơ|thịt bò,súp lơ,tỏi|xào|25|everyday
Bò xào ngồng cải|thịt bò,ngồng cải,tỏi|xào|20|quick
Bò xào nấm hương|thịt bò,nấm hương,gừng|xào|25|everyday
Bò sốt tiêu đen|thịt bò,tiêu đen,hành tây|sốt|35|weekend
Bò lúc lắc kiểu Việt|thịt bò,ớt chuông,hành tây|xào|25|weekend
Bò kho gừng|thịt bò,gừng,nước mắm|kho|75|weekend
Bò hầm khoai tây cà rốt|thịt bò,khoai tây,cà rốt|hầm|90|weekend
Bò cuốn lá lốt|thịt bò,lá lốt,sả|nướng|40|nhau
Bò tái chanh|thịt bò,chanh,hành tây,rau thơm|trộn|35|nhau
Bò hấp sả|thịt bò,sả,gừng|hấp|40|nhau
Bò xào dưa chua|thịt bò,dưa cải chua,cà chua|xào|25|everyday
Bê tái chanh|thịt bê,chanh,sả,rau ngổ|trộn|40|nhau
Bê xào lăn|thịt bê,sả,nghệ,hành tây|xào|35|nhau
Bê hấp gừng|thịt bê,gừng,sả|hấp|45|weekend
`
  },
  {
    group: 'poultry', role: 'main', emoji: '🍗',
    rows: `
Gà rang gừng|thịt gà,gừng,nước mắm|rang|35|everyday
Gà luộc lá chanh|thịt gà,lá chanh,gừng|luộc|50|weekend
Gà rang muối|thịt gà,sả,lá chanh,muối|rang|50|nhau
Gà hấp hành|thịt gà,hành lá,gừng|hấp|45|weekend
Gà hấp nấm hương|thịt gà,nấm hương,gừng|hấp|50|weekend
Gà nướng mật ong|thịt gà,mật ong,tỏi|nướng|60|weekend
Gà nướng mắc khén|thịt gà,mắc khén,sả|nướng|65|nhau
Gà xào sả ớt|thịt gà,sả,ớt|xào|30|nhau
Gà kho nghệ|thịt gà,nghệ,hành tím|kho|40|everyday
Gà kho nấm|thịt gà,nấm hương,hành tím|kho|45|everyday
Gà om khoai tây|thịt gà,khoai tây,cà rốt|om|55|weekend
Gà nấu đông|thịt gà,mộc nhĩ,nấm hương|ninh|75|weekend
Gà xào hạt điều|thịt gà,hạt điều,ớt chuông|xào|30|weekend
Gà xé phay hành tây|thịt gà,hành tây,rau răm|trộn|35|nhau
Gà xào lăn|thịt gà,sả,nghệ|xào|30|weekend
Gà rán lá chanh|thịt gà,lá chanh,tỏi|rán|40|everyday
Gà hầm hạt sen|thịt gà,hạt sen,nấm hương|hầm|90|weekend
Gà ác tần ngải cứu|gà ác,ngải cứu,gừng|hầm|85|weekend
Vịt luộc chấm gừng|thịt vịt,gừng,muối|luộc|55|weekend
Vịt om sấu|thịt vịt,sấu,khoai sọ,sả|om|80|weekend,nhau
Vịt rang riềng|thịt vịt,riềng,nước mắm|rang|45|nhau
Vịt nướng lá mắc mật|thịt vịt,lá mắc mật,mật ong|nướng|90|nhau
Vịt hấp sả gừng|thịt vịt,sả,gừng|hấp|55|weekend
Vịt xào măng|thịt vịt,măng tươi,gừng|xào|40|nhau
Vịt kho gừng|thịt vịt,gừng,nước mắm|kho|65|everyday
Ngan cháy tỏi|thịt ngan,tỏi,sả|rán|55|nhau
Ngan luộc lá chanh|thịt ngan,lá chanh,gừng|luộc|55|weekend
Ngan giả cầy|thịt ngan,riềng,mẻ,mắm tôm|om|85|nhau
Chim cút quay|chim cút,mật ong,tỏi|quay|50|weekend
Chim bồ câu hầm hạt sen|chim bồ câu,hạt sen,gừng|hầm|90|weekend
`
  },
  {
    group: 'fish-seafood', role: 'main', emoji: '🐟',
    rows: `
Cá trắm kho riềng|cá trắm,riềng,nước mắm|kho|75|everyday
Cá chép kho tương|cá chép,tương bần,riềng|kho|70|everyday
Cá diếc kho tương|cá diếc,tương bần,gừng|kho|70|everyday
Cá rô phi rán giòn|cá rô phi,gừng,muối|rán|30|everyday
Cá rô đồng chiên giòn|cá rô đồng,bột gạo,muối|rán|30|everyday
Cá thu sốt cà chua|cá thu,cà chua,hành lá|sốt|30|everyday
Cá nục kho cà chua|cá nục,cà chua,nước mắm|kho|50|everyday
Cá quả kho tộ|cá quả,tiêu,nước mắm|kho|60|everyday
Cá bống kho tiêu|cá bống,tiêu,nước mắm|kho|55|everyday
Cá bạc má kho gừng|cá bạc má,gừng,nước mắm|kho|50|everyday
Cá trê kho riềng|cá trê,riềng,nước mắm|kho|70|everyday
Cá trạch kho nghệ|cá trạch,nghệ,hành tím|kho|60|everyday
Cá lóc hấp hành gừng|cá lóc,gừng,hành lá|hấp|45|weekend
Cá diêu hồng hấp xì dầu|cá diêu hồng,xì dầu,gừng|hấp|45|weekend
Cá chép hấp bia|cá chép,bia,gừng,sả|hấp|55|weekend
Cá trắm hấp gừng|cá trắm,gừng,hành lá|hấp|45|weekend
Cá vược hấp xì dầu|cá vược,xì dầu,gừng|hấp|45|weekend
Cá lăng om chuối đậu|cá lăng,chuối xanh,đậu phụ,mẻ|om|75|weekend
Cá chép om dưa|cá chép,dưa cải chua,cà chua|om|65|weekend
Cá quả nướng trui|cá quả,sả,rau thơm|nướng|60|nhau
Cá trắm nướng riềng mẻ|cá trắm,riềng,mẻ|nướng|65|nhau
Cá lăng nướng riềng mẻ|cá lăng,riềng,mẻ|nướng|65|nhau
Cá rô phi nướng giấy bạc|cá rô phi,sả,gừng|nướng|45|nhau
Cá chỉ vàng nướng|cá chỉ vàng,muối,ớt|nướng|20|nhau
Cá cơm rang lạc|cá cơm,lạc,nước mắm|rang|25|everyday
Cá khô rim mắm đường|cá khô,nước mắm,đường|rim|20|everyday
Cá tép dầu chiên giòn|cá tép dầu,bột gạo,muối|rán|25|everyday
Tôm đồng rang khế|tôm đồng,khế chua,nước mắm|rang|25|everyday
Tôm rang thịt ba chỉ|tôm,thịt ba chỉ,nước mắm|rang|35|everyday
Tôm rang lá chanh|tôm,lá chanh,muối|rang|25|everyday
Tôm hấp sả|tôm,sả,gừng|hấp|20|weekend
Tôm chiên bơ tỏi|tôm,bơ,tỏi|chiên|25|weekend
Tôm sốt me|tôm,me,đường|sốt|30|weekend
Tôm rim mắm|tôm,nước mắm,hành tím|rim|25|everyday
Tôm cuộn khoai tây chiên|tôm,khoai tây,bột mì|chiên|45|weekend
Tép đồng rang khế|tép đồng,khế chua,hành tím|rang|20|everyday
Tép rang lá chanh|tép đồng,lá chanh,nước mắm|rang|20|everyday
Cua đồng rang lá lốt|cua đồng,lá lốt,muối|rang|35|everyday
Ghẹ hấp sả|ghẹ,sả,gừng|hấp|30|weekend
Cua biển hấp bia|cua biển,bia,sả|hấp|35|weekend
Mực xào cần tỏi|mực,cần tây,tỏi|xào|25|everyday
Mực hấp gừng|mực,gừng,hành lá|hấp|25|nhau
Mực chiên giòn|mực,bột chiên,muối|chiên|30|nhau
Mực nướng sa tế|mực,sa tế,sả|nướng|35|nhau
Bạch tuộc nướng sả|bạch tuộc,sả,ớt|nướng|35|nhau
Ngao hấp sả|ngao,sả,ớt|hấp|20|nhau
Sò huyết rang me|sò huyết,me,tỏi|rang|30|nhau
Hến xào hành răm|hến,hành tím,rau răm|xào|25|everyday
Ốc nhồi hấp gừng|ốc nhồi,gừng,lá chanh|hấp|40|nhau
Ốc xào sả ớt|ốc,sả,ớt|xào|35|nhau
`
  },
  {
    group: 'egg-tofu', role: 'secondary', emoji: '🥚',
    rows: `
Trứng rán hành|trứng gà,hành lá,dầu ăn|rán|10|quick
Trứng đúc thịt|trứng gà,thịt lợn,hành lá|rán|20|quick
Trứng đúc nấm|trứng gà,nấm hương,hành lá|rán|20|quick
Trứng hấp vân|trứng gà,mộc nhĩ,cà rốt|hấp|35|weekend
Trứng hấp nấm|trứng gà,nấm kim châm,hành lá|hấp|20|quick
Trứng luộc|trứng gà,muối|luộc|12|quick
Trứng cút rim mắm|trứng cút,nước mắm,hành tím|rim|20|everyday
Trứng cút sốt cà chua|trứng cút,cà chua,hành tím|sốt|25|everyday
Trứng rán ngải cứu|trứng gà,ngải cứu,dầu ăn|rán|15|quick
Trứng rán lá mơ|trứng gà,lá mơ,dầu ăn|rán|15|quick
Trứng rán cốm|trứng gà,cốm,hành lá|rán|20|weekend
Trứng kho nước tương|trứng gà,nước tương,gừng|kho|30|everyday
Đậu phụ rán vàng|đậu phụ,dầu ăn,muối|rán|15|quick
Đậu phụ sốt cà chua|đậu phụ,cà chua,hành lá,muối|sốt|20|quick
Đậu phụ tẩm hành|đậu phụ,hành lá,nước mắm|rán|20|nhau
Đậu phụ kho nấm|đậu phụ,nấm hương,nước tương|kho|25|quick
Đậu phụ kho tương|đậu phụ,tương bần,gừng|kho|25|quick
Đậu phụ sốt nấm|đậu phụ,nấm rơm,nước tương|sốt|20|quick
Đậu phụ hấp nấm kim châm|đậu phụ,nấm kim châm,nước tương|hấp|20|quick
Đậu phụ chiên sả|đậu phụ,sả,muối|rán|20|quick
Đậu phụ xào sả ớt|đậu phụ,sả,ớt,nước tương|xào|20|quick
Đậu phụ om chuối xanh|đậu phụ,chuối xanh,nghệ,mẻ|om|40|everyday
Đậu phụ nhồi thịt sốt cà|đậu phụ,thịt lợn,cà chua|sốt|35|everyday
Đậu phụ non hấp trứng|đậu phụ non,trứng gà,hành lá|hấp|25|quick
Đậu phụ non sốt tương gừng|đậu phụ non,nước tương,gừng|sốt|15|quick
Đậu phụ cuộn lá lốt|đậu phụ,lá lốt,nấm hương|rán|30|everyday
Chả đậu xanh|đậu xanh,đậu phụ,hành tím|rán|35|everyday
Chả nấm hương|nấm hương,đậu phụ,bột năng|rán|30|everyday
Nấm đùi gà kho tiêu|nấm đùi gà,tiêu,nước tương|kho|25|quick
Nấm rơm xào đậu phụ|nấm rơm,đậu phụ,tỏi|xào|20|quick
`
  },
  {
    group: 'vegetables', role: 'vegetable', emoji: '🥬',
    rows: `
Rau muống luộc|rau muống,muối|luộc|12|quick
Rau muống xào tỏi|rau muống,tỏi,dầu ăn|xào|15|quick
Rau cải ngọt luộc|cải ngọt,muối|luộc|12|quick
Cải ngồng xào tỏi|cải ngồng,tỏi,dầu ăn|xào|15|quick
Cải thìa xào nấm|cải thìa,nấm hương,tỏi|xào|18|quick
Cải chíp luộc|cải chíp,muối|luộc|12|quick
Cải bẹ xanh xào tỏi|cải bẹ xanh,tỏi,dầu ăn|xào|15|quick
Bắp cải luộc|bắp cải,muối|luộc|15|quick
Bắp cải xào cà chua|bắp cải,cà chua,tỏi|xào|18|quick
Bắp cải xào trứng|bắp cải,trứng gà,hành lá|xào|20|quick
Su hào xào cà rốt|su hào,cà rốt,tỏi|xào|20|quick
Su hào luộc|su hào,muối|luộc|15|quick
Su su luộc|su su,muối|luộc|15|quick
Ngọn su su xào tỏi|ngọn su su,tỏi,dầu ăn|xào|15|quick
Đỗ xanh xào tỏi|đỗ que,tỏi,dầu ăn|xào|18|quick
Đỗ luộc chấm vừng|đỗ que,vừng,muối|luộc|15|quick
Đỗ xào nấm|đỗ que,nấm rơm,tỏi|xào|20|quick
Bí xanh luộc|bí xanh,muối|luộc|15|quick
Bí đỏ xào tỏi|bí đỏ,tỏi,dầu ăn|xào|20|quick
Bí ngòi xào nấm|bí ngòi,nấm hương,tỏi|xào|18|quick
Mướp xào giá đỗ|mướp,giá đỗ,tỏi|xào|18|quick
Mướp đắng xào trứng|mướp đắng,trứng gà,hành tím|xào|20|quick
Mướp đắng xào nấm|mướp đắng,nấm rơm,tỏi|xào|20|quick
Cà tím nướng mỡ hành|cà tím,hành lá,dầu ăn|nướng|30|everyday
Cà tím xào tỏi|cà tím,tỏi,nước tương|xào|20|quick
Cà tím om đậu|cà tím,đậu phụ,nghệ,mẻ|om|35|everyday
Rau dền luộc|rau dền,muối|luộc|12|quick
Rau lang luộc|rau lang,muối|luộc|15|quick
Rau lang xào tỏi|rau lang,tỏi,dầu ăn|xào|15|quick
Rau cải xoong xào tỏi|cải xoong,tỏi,dầu ăn|xào|15|quick
Rau cần xào nấm|rau cần,nấm hương,tỏi|xào|20|quick
Giá đỗ xào hẹ|giá đỗ,hẹ,tỏi|xào|12|quick
Giá đỗ luộc|giá đỗ,muối|luộc|10|quick
Súp lơ xanh luộc|súp lơ xanh,muối|luộc|15|quick
Súp lơ xào cà rốt|súp lơ,cà rốt,tỏi|xào|20|quick
Củ cải xào cà rốt|củ cải,cà rốt,tỏi|xào|20|quick
Củ cải luộc|củ cải,muối|luộc|18|quick
Nộm su hào cà rốt|su hào,cà rốt,chanh,lạc|trộn|20|everyday
Nộm hoa chuối lạc|hoa chuối,lạc,chanh,rau thơm|trộn|25|nhau
Nộm đu đủ cà rốt|đu đủ xanh,cà rốt,chanh,lạc|trộn|25|everyday
Nộm dưa chuột|dưa chuột,chanh,tỏi|trộn|10|quick
Nộm rau muống|rau muống,lạc,chanh,tỏi|trộn|25|nhau
`
  },
  {
    group: 'soups', role: 'soup', emoji: '🍲',
    rows: `
Canh rau ngót thịt băm|rau ngót,thịt lợn,hành tím|nấu|20|quick
Canh cải thịt băm|rau cải,thịt lợn,gừng|nấu|20|quick
Canh bí xanh nấu tôm|bí xanh,tôm,hành lá|nấu|25|quick
Canh bí xanh nấu xương|bí xanh,xương lợn,hành lá|nấu|60|everyday
Canh mướp nấu mồng tơi|mướp,mồng tơi,muối|nấu|18|quick
Canh cua rau đay mồng tơi|cua đồng,rau đay,mồng tơi,mướp|nấu|40|everyday
Canh cua mướp hương|cua đồng,mướp,rau đay|nấu|35|everyday
Canh bầu nấu tôm|bầu,tôm,hành lá|nấu|25|quick
Canh bầu nấu thịt băm|bầu,thịt lợn,hành tím|nấu|25|quick
Canh rau dền nấu tôm|rau dền,tôm,hành lá|nấu|25|quick
Canh rau dền nấu thịt|rau dền,thịt lợn,hành tím|nấu|25|quick
Canh khoai tây cà rốt hầm xương|khoai tây,cà rốt,xương lợn|hầm|65|everyday
Canh sườn nấu sấu|sườn lợn,sấu,cà chua|nấu|55|everyday
Canh ngao nấu chua|ngao,cà chua,dứa,rau răm|nấu|30|everyday
Canh hến nấu bầu|hến,bầu,hành lá|nấu|30|everyday
Canh cá rô nấu cải|cá rô đồng,rau cải,gừng|nấu|45|everyday
Canh cá nấu dưa chua|cá, dưa cải chua,cà chua|nấu|45|everyday
Canh riêu cá chép|cá chép,cà chua,thì là|nấu|45|everyday
Canh riêu cua cà chua|cua đồng,cà chua,hành lá|nấu|40|everyday
Canh chua cá quả|cá quả,cà chua,dọc mùng,thì là|nấu|45|everyday
Canh cải cúc nấu thịt|cải cúc,thịt lợn,gừng|nấu|20|quick
Canh cải xoong nấu thịt|cải xoong,thịt lợn,hành tím|nấu|20|quick
Canh mướp đắng nhồi thịt|mướp đắng,thịt lợn,mộc nhĩ|nấu|45|everyday
Canh mọc nấm hương|giò sống,nấm hương,mộc nhĩ|nấu|45|weekend
Canh măng mọc|măng khô,giò sống,xương lợn|ninh|85|weekend
Canh măng móng giò|măng khô,móng giò,hành lá|ninh|100|weekend
Canh bóng thả|bóng bì lợn,tôm,giò sống,cà rốt|nấu|70|weekend
Canh khoai sọ nấu sườn|khoai sọ,sườn lợn,hành lá|nấu|55|everyday
Canh chuối xanh nấu ốc|ốc,chuối xanh,đậu phụ,mẻ|om|65|weekend
Canh nấm đậu phụ|nấm rơm,đậu phụ,hành lá,muối|nấu|20|quick
Canh cải thảo nấm|cải thảo,nấm hương,gừng,muối|nấu|18|quick
Canh bí đỏ nấu đậu xanh|bí đỏ,đậu xanh,muối|nấu|30|everyday
Canh củ cải cà rốt|củ cải,cà rốt,gừng,muối|nấu|22|quick
Canh rong biển đậu phụ|rong biển,đậu phụ,gừng,muối|nấu|15|quick
Canh cà chua trứng|cà chua,trứng gà,hành lá|nấu|15|quick
Canh mướp nấu lạc|mướp,lạc,hành lá|nấu|25|quick
Canh bắp cải nấu thịt|bắp cải,thịt lợn,hành lá|nấu|25|quick
Canh rau tập tàng|rau dền,rau ngót,mồng tơi,muối|nấu|20|quick
Canh rau khoai nấu tôm|rau lang,tôm,hành lá|nấu|25|quick
Canh ngải cứu nấu trứng|ngải cứu,trứng gà,gừng|nấu|25|quick
`
  },
  {
    group: 'hotpot', role: 'hotpot', emoji: '♨️',
    rows: `
Lẩu riêu cua bắp bò|cua đồng,thịt bò,cà chua,đậu phụ|lẩu|75|special
Lẩu cá chép om dưa|cá chép,dưa cải chua,cà chua|lẩu|75|special
Lẩu cá lăng măng chua|cá lăng,măng chua,cà chua|lẩu|70|special
Lẩu ếch măng cay|thịt ếch,măng,tỏi,ớt|lẩu|70|special,spicy
Lẩu gà nấm|thịt gà,nấm hương,nấm kim châm|lẩu|65|special
Lẩu gà lá giang|thịt gà,lá giang,sả|lẩu|60|special
Lẩu vịt om sấu|thịt vịt,sấu,khoai sọ|lẩu|85|special
Lẩu bò nhúng giấm|thịt bò,giấm,gừng,hành tây|lẩu|60|special
Lẩu hải sản chua cay|tôm,mực,ngao,cà chua,ớt|lẩu|65|special,spicy
Lẩu cua đồng rau rừng|cua đồng,rau rừng,đậu phụ|lẩu|70|special
Lẩu cá quả chua|cá quả,cà chua,dứa|lẩu|65|special
Lẩu ngan măng|thịt ngan,măng tươi,gừng|lẩu|80|special
Lẩu nấm chay|nấm hương,nấm kim châm,đậu phụ,rau cải|lẩu|50|special,vegetarian
Lẩu đậu phụ rau củ|đậu phụ,cải thảo,cà rốt,nấm rơm|lẩu|45|special,vegetarian
`
  },
  {
    group: 'barbecue', role: 'barbecue', emoji: '🔥',
    rows: `
Ba chỉ nướng riềng mẻ|thịt ba chỉ,riềng,mẻ|nướng|55|nhau
Sườn nướng ngũ vị|sườn lợn,ngũ vị hương,mật ong|nướng|60|nhau
Thịt xiên nướng Hà Nội|thịt lợn,sả,mật ong|nướng|50|nhau
Bò nướng tảng|thịt bò,tiêu,tỏi|nướng|55|nhau
Bò cuốn nấm nướng|thịt bò,nấm kim châm,hành lá|nướng|40|nhau
Gà nướng lá chanh|thịt gà,lá chanh,sả|nướng|65|nhau
Vịt nướng riềng|thịt vịt,riềng,mẻ|nướng|70|nhau
Cá lăng nướng than|cá lăng,riềng,nghệ|nướng|65|nhau
Cá tầm nướng muối ớt|cá tầm,muối,ớt|nướng|60|nhau,spicy
Mực nướng muối ớt|mực,muối,ớt|nướng|35|nhau,spicy
Tôm nướng bơ tỏi|tôm,bơ,tỏi|nướng|30|nhau
Nấm đùi gà nướng|nấm đùi gà,nước tương,tỏi|nướng|25|vegetarian
`
  },
  {
    group: 'appetizer', role: 'appetizer', emoji: '🥟',
    rows: `
Nem rán Hà Nội|thịt lợn,trứng gà,mộc nhĩ,miến|rán|55|nhau
Nem cua bể Hải Phòng|cua biển,thịt lợn,miến,bánh đa nem|rán|60|nhau
Nem chua rán|nem chua,bột chiên,dầu ăn|rán|25|nhau
Khoai tây chiên|khoai tây,dầu ăn,muối|chiên|20|nhau
Khoai lang chiên|khoai lang,bột mì,dầu ăn|chiên|25|nhau
Lạc rang húng lìu|lạc,húng lìu,muối|rang|20|nhau
Lạc luộc|lạc,muối|luộc|30|nhau
Ngô chiên bơ|ngô ngọt,bơ,bột chiên|chiên|25|nhau
Nộm chân gà rút xương|chân gà,cà rốt,dưa chuột,chanh|trộn|45|nhau
Nộm tai heo hoa chuối|tai heo,hoa chuối,chanh,lạc|trộn|50|nhau
Nộm bò bóp thấu|thịt bò,chuối xanh,khế,chanh|trộn|40|nhau
Nộm sứa xoài xanh|sứa,xoài xanh,lạc,chanh|trộn|30|nhau
`
  },
  {
    group: 'staples', role: 'staple', emoji: '🍚',
    rows: `
Cơm trắng|gạo tẻ,nước|nấu|25|everyday
Cơm gạo lứt|gạo lứt,nước|nấu|40|everyday
Cơm trộn ngô ngọt|gạo tẻ,ngô ngọt,nước|nấu|30|everyday
Cơm đậu xanh|gạo tẻ,đậu xanh,nước|nấu|35|everyday
Cơm nếp|gạo nếp,nước|đồ|40|weekend
Xôi xéo|gạo nếp,đậu xanh,hành phi|đồ|60|weekend
Xôi lạc|gạo nếp,lạc,nước|đồ|55|weekend
Xôi đỗ xanh|gạo nếp,đậu xanh,nước|đồ|50|weekend
Bún tươi|bún gạo,nước|trụng|5|quick
Bánh đa đỏ Hải Phòng|bánh đa đỏ,nước|trụng|7|quick
Mì gạo|mì gạo,nước|trụng|8|quick
Miến dong|miến dong,nước|trụng|7|quick
Bánh phở tươi|bánh phở,nước|trụng|5|quick
Khoai lang luộc|khoai lang,nước|luộc|25|quick
Khoai tây hấp|khoai tây,nước|hấp|25|quick
Ngô nếp luộc|ngô nếp,nước|luộc|30|everyday
`
  },
  {
    group: 'sides', role: 'side', emoji: '🥒',
    rows: `
Cà pháo muối|cà pháo,muối,tỏi|muối|5|everyday
Dưa cải muối chua|dưa cải,muối,nước|muối|5|everyday
Dưa góp su hào|su hào,cà rốt,giấm|trộn|15|everyday
Dưa chuột thái lát|dưa chuột,muối|sơ chế|5|quick
Rau sống thập cẩm|xà lách,kinh giới,tía tô|sơ chế|10|quick
Rau thơm lá sung|lá sung,tía tô,kinh giới|sơ chế|8|quick
Kim chi cải thảo chay|cải thảo,ớt,bột gạo,muối|muối|5|everyday,spicy
Hành muối chua|hành củ,muối,giấm|muối|5|everyday
Kiệu muối|củ kiệu,giấm,muối|muối|5|everyday
Sung muối xổi|quả sung,muối,chanh,ớt|muối|10|everyday
Đậu bắp luộc|đậu bắp,muối|luộc|10|quick
Nấm kim châm hấp|nấm kim châm,gừng,nước tương|hấp|15|quick
Rau diếp cuốn|rau diếp,kinh giới,tía tô|sơ chế|10|quick
Cà rốt dưa chuột ngâm giấm|cà rốt,dưa chuột,giấm|trộn|15|quick
Nước chấm tương gừng|nước tương,gừng,chanh|pha|5|quick
Muối vừng lạc|vừng,lạc,muối|rang|15|everyday
`
  },
  {
    group: 'dipping-vegetables', role: 'dippingVeg', emoji: '🥬',
    rows: `
Rau muống nhúng lẩu|rau muống|sơ chế|10|special
Rau cải thảo nhúng lẩu|cải thảo|sơ chế|10|special
Rau cải cúc nhúng lẩu|cải cúc|sơ chế|10|special
Rau cần nước nhúng lẩu|rau cần nước|sơ chế|10|special
Hoa chuối bào nhúng lẩu|hoa chuối|sơ chế|15|special
Rau mồng tơi nhúng lẩu|mồng tơi|sơ chế|10|special
Nấm kim châm nhúng lẩu|nấm kim châm|sơ chế|5|special
Nấm hương tươi nhúng lẩu|nấm hương|sơ chế|8|special
Nấm đùi gà nhúng lẩu|nấm đùi gà|sơ chế|8|special
Đậu phụ nhúng lẩu|đậu phụ|sơ chế|5|special
Rau cải ngọt nhúng lẩu|cải ngọt|sơ chế|10|special
Rau xà lách nhúng lẩu|xà lách|sơ chế|8|special
`
  },
  {
    group: 'dipping-proteins', role: 'dippingProtein', emoji: '🥩',
    rows: `
Bắp bò thái lát nhúng|thịt bò|sơ chế|15|special
Thịt bò cuộn nhúng|thịt bò|sơ chế|15|special
Thịt lợn thái mỏng nhúng|thịt lợn|sơ chế|15|special
Gà ta chặt miếng nhúng|thịt gà|sơ chế|20|special
Tôm tươi nhúng lẩu|tôm|sơ chế|12|special
Mực tươi nhúng lẩu|mực|sơ chế|15|special
Cá quả phi lê nhúng|cá quả|sơ chế|20|special
Giò sống viên nhúng|giò sống|sơ chế|15|special
Đậu phụ non nhúng|đậu phụ non|sơ chế|5|special
Nấm đùi gà thái lát nhúng|nấm đùi gà|sơ chế|8|special
`
  }
];

function normalize(str) {
  return String(str).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').trim();
}

const patterns = {
  pork: /\b(thit lon|thit ba chi|suon lon|suon non|suon sun|xuong lon|chan gio|mong gio|long lon|tai heo|tiet lon|bi lon|bong bi lon|gio song|nem chua|doi lon|than lon|than heo|mo lon)\b/,
  beef: /\b(thit bo|bap bo|thit be)\b/,
  chicken: /\b(thit ga|ga ac|chan ga)\b/,
  duck: /\b(thit vit|thit ngan)\b/,
  fish: /\b(nuoc mam|tuong ca)\b/,
  seafood: /\b(tom|tep|cua|ghe|muc|bach tuoc|ngao|hen|so huyet|oc|sua|hau|mam tom|mam tep)\b/,
  egg: /\b(trung)\b/,
  soy: /\b(dau phu|dau non|nuoc tuong|tuong ban|xi dau)\b/,
  offal: /\b(long lon|doi lon|gan lon|tim lon|tai heo|tiet lon)\b/,
  spicy: /\b(ot|sa te)\b/,
  peanuts: /\b(lac|dau phong)\b/,
  sesame: /\b(vung|me rang)\b/,
  gluten: /\b(bot mi|mi gao|mi soi|banh da|banh pho|bi a|bia|xi dau|nuoc tuong)\b/
};

export const EXCLUSION_OPTIONS = Object.freeze([
  ['pork', 'Thịt lợn'], ['beef', 'Thịt bò'], ['chicken', 'Thịt gà'],
  ['duck', 'Vịt / ngan'], ['fish', 'Cá / nước mắm'],
  ['seafood', 'Hải sản / mắm tôm'], ['egg', 'Trứng'],
  ['soy', 'Đậu nành'], ['offal', 'Nội tạng'], ['spicy', 'Đồ cay']
]);

const animalGroups = ['pork', 'beef', 'chicken', 'duck', 'fish', 'seafood', 'egg'];

function itemToDish(line, section, index) {
  const [name, ingredientText, method, timeText, tagsText = ''] = line.split('|').map(x => x.trim());
  if (!name || !ingredientText || !method || !timeText) throw Error(`Dòng dữ liệu lỗi: ${line}`);
  const ingredients = ingredientText.split(',').map(x => x.trim()).filter(Boolean);
  const ingredientSearch = normalize(ingredients.join(' '));
  const ingredientGroups = Object.entries(patterns).filter(([, re]) => re.test(ingredientSearch)).map(([key]) => key);
  // Không bỏ dấu khi nhận diện cá: "cá" và "cà" sẽ trùng thành "ca".
  if (/(^|[,\s])cá([,\s]|$)/u.test(ingredientText.toLowerCase()) && !ingredientGroups.includes('fish')) ingredientGroups.push('fish');
  const tags = tagsText.split(',').map(x => x.trim()).filter(Boolean);
  const estimatedTime = Number(timeText);
  const vegetarian = !animalGroups.some(group => ingredientGroups.includes(group)) &&
    !/\b(thit ech|chim cut|chim bo cau|thit ngan|thit be|bong bi|mam|nuoc dung xuong)\b/.test(ingredientSearch);
  const role = section.role;
  const mealTypes = new Set();
  if (['main', 'secondary', 'vegetable', 'soup', 'staple', 'side'].includes(role)) mealTypes.add('family');
  if (['main', 'secondary', 'vegetable', 'soup', 'staple', 'side', 'hotpot', 'barbecue', 'appetizer', 'dippingVeg', 'dippingProtein'].includes(role)) mealTypes.add('special');
  if (['main', 'secondary', 'vegetable', 'soup', 'staple', 'side', 'appetizer', 'barbecue', 'hotpot'].includes(role) &&
      (tags.includes('nhau') || ['appetizer', 'barbecue', 'vegetable', 'side', 'hotpot'].includes(role))) mealTypes.add('nhau');
  if (estimatedTime <= 30 && ['main', 'secondary', 'vegetable', 'soup', 'staple', 'side'].includes(role)) mealTypes.add('quick');

  const nutritionGroups = [];
  if (['main', 'secondary', 'dippingProtein', 'hotpot', 'barbecue'].includes(role) ||
      ingredientGroups.some(g => animalGroups.includes(g) || g === 'soy')) nutritionGroups.push('protein');
  if (['vegetable', 'dippingVeg'].includes(role) || ingredients.some(v => /rau|cải|bí|mướp|cà rốt|su hào|nấm|giá đỗ|dưa chuột|bầu|súp lơ/.test(v))) nutritionGroups.push('vegetables');
  if (role === 'staple' || ingredients.some(v => /khoai|bún|miến|mì gạo/.test(v))) nutritionGroups.push('carbs');
  if (ingredients.some(v => /dầu|mỡ|bơ|lạc|vừng|thịt|trứng|cá|tôm|đậu phụ/.test(v))) nutritionGroups.push('fat-source');

  const flavorProfile = /kho|rim|rang|sốt|nướng|rán|chiên/.test(method) ? 'đậm đà' :
    /luộc|hấp|trụng|sơ chế/.test(method) ? 'thanh nhẹ' : 'hài hòa';
  return Object.freeze({
    id: `${section.group}-${String(index + 1).padStart(3, '0')}`,
    name, category: section.group, role, subCategory: ingredientGroups[0] || section.group,
    mealTypes: Object.freeze([...mealTypes]), ingredients: Object.freeze(ingredients),
    ingredientGroups: Object.freeze(ingredientGroups), nutritionGroups: Object.freeze([...new Set(nutritionGroups)]),
    cookingMethod: method, flavorProfile, estimatedTime, servings: 4,
    difficulty: estimatedTime <= 25 ? 'easy' : estimatedTime >= 65 ? 'advanced' : 'medium',
    region: 'northern-or-common', occasion: Object.freeze(tags),
    tags: Object.freeze(tags), allergens: Object.freeze(ingredientGroups.filter(g => ['fish', 'seafood', 'egg', 'soy', 'peanuts', 'sesame', 'gluten'].includes(g))),
    season: Object.freeze(['all']), vegetarian, weight: tags.includes('everyday') || tags.includes('quick') ? 9 : 7,
    emoji: section.emoji
  });
}

export const DISHES = Object.freeze(sections.flatMap(section => section.rows.trim().split('\n').filter(Boolean).map((line, i) => itemToDish(line, section, i))));
export const DISH_BY_ID = new Map(DISHES.map(d => [d.id, d]));
export const DATA_STATS = Object.freeze(Object.fromEntries(sections.map(section => [section.group, DISHES.filter(d => d.category === section.group).length])));

export function isDishAllowed(dish, options = {}) {
  const excluded = options.excludedIngredients || [];
  if (options.vegetarian && !dish.vegetarian) return false;
  return !excluded.some(group => dish.ingredientGroups.includes(group));
}

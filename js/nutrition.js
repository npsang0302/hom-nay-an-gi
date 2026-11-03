/* Đánh giá định tính nhóm thực phẩm, không phải phân tích dinh dưỡng định lượng. */
export function evaluateBalance(items) {
  const has = role => items.some(i => i.role === role);
  const groups = new Set(items.flatMap(i => i.dish.nutritionGroups));
  const carbs = groups.has('carbs') || has('staple');
  const protein = groups.has('protein') || has('main') || has('hotpot') || has('barbecue');
  const vegetables = groups.has('vegetables') || has('vegetable') || has('dippingVeg');
  const fats = groups.has('fat-source');
  const variety = new Set(items.map(i => i.dish.category)).size >= 4;
  const checks = [
    { key: 'carbs', label: 'Tinh bột', ok: carbs },
    { key: 'protein', label: 'Nguồn đạm', ok: protein },
    { key: 'vegetables', label: 'Rau củ / chất xơ', ok: vegetables },
    { key: 'fats', label: 'Nguồn chất béo', ok: fats },
    { key: 'variety', label: 'Đa dạng nhóm món', ok: variety }
  ];
  const hints = [];
  if (!carbs) hints.push('Nên bổ sung cơm, bún, miến hoặc một nguồn tinh bột phù hợp.');
  if (!protein) hints.push('Nên bổ sung một nguồn đạm như cá, thịt, trứng hoặc đậu phụ.');
  if (!vegetables) hints.push('Bữa này ít rau củ; hãy thêm rau xanh hoặc một đĩa nộm.');
  if (!fats) hints.push('Có thể bổ sung một lượng chất béo phù hợp từ dầu thực vật, hạt hoặc thực phẩm giàu đạm.');
  if (!variety) hints.push('Hãy cân nhắc đổi bớt món để đa dạng nguyên liệu và cách chế biến.');
  const checked = checks.filter(x => x.ok).length;
  return {
    checks,
    score: checked * 20,
    label: checked === 5 ? 'Khá cân đối' : checked >= 3 ? 'Tương đối đa dạng' : 'Cần bổ sung',
    hints,
    disclaimer: 'Đánh giá định tính theo nhóm thực phẩm; không thay thế tư vấn dinh dưỡng hay tính khẩu phần cá nhân.'
  };
}

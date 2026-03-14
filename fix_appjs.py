from pathlib import Path

p = Path(r'c:\Users\RUT\OneDrive\Desktop\3BM\app.js')
text = p.read_text(encoding='utf-8')
start = text.find('// Filters')
end = text.find('// ==================== DELIVERY ====', start)
if start == -1 or end == -1:
    raise SystemExit('Markers not found')
old = text[start:end]
new = """// Filters
function filterStock(){const q=document.getElementById('stock-q').value.toLowerCase();renderStock(STOCK.filter(s=>s.name.toLowerCase().includes(q)||s.sku.toLowerCase().includes(q)));}
function filterOrders(){
  const q=document.getElementById('order-q').value.toLowerCase();
  const st=document.getElementById('order-sf').value;
  renderOrders(ORDERS.filter(o=>{
    const matchesQuery = o.product.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
    return matchesQuery && (!st || o.status === st);
  }));
}

"""
if old == new:
    print('Block already fixed, no changes made')
else:
    p.write_text(text[:start] + new + text[end:], encoding='utf-8')
    print('Block replaced')

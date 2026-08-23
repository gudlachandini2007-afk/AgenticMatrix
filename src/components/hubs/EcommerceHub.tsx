import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Send,
  Bot,
  User,
  AlertTriangle,
  Package,
  ArrowUpRight,
  Search,
  Filter,
  Plus,
  RotateCcw,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Store,
  Star,
  Truck,
  Check,
  X,
  Database,
  Info
} from 'lucide-react';
import { ChatMessage, InventoryItem } from '../../types';
import gridStyles from '../../styles/grid.module.css';

interface EcommerceHubProps {
  chatMessages: ChatMessage[];
  inventoryItems: InventoryItem[];
  onSendMessage: (msg: ChatMessage) => void;
  onRestockItem: (itemId: string, quantity: number) => void;
  onBuyItem?: (itemId: string, quantity: number) => void;
}

export const EcommerceHub: React.FC<EcommerceHubProps> = ({
  chatMessages,
  inventoryItems,
  onSendMessage,
  onRestockItem,
  onBuyItem
}) => {
  // Chat State
  const [inputText, setInputText] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inventory Table State
  const [inventorySearch, setInventorySearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [restockModalItem, setRestockModalItem] = useState<InventoryItem | null>(null);
  const [restockQty, setRestockQty] = useState(100);

  // Buy / Storefront Navigation Modal State
  const [buyModalItem, setBuyModalItem] = useState<InventoryItem | null>(null);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [buySuccess, setBuySuccess] = useState(false);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isAgentTyping]);

  // Execute Instant AI Purchase & Stock Deduction
  const handleExecuteBuy = (item: InventoryItem, qty: number = 1) => {
    if (onBuyItem) {
      onBuyItem(item.id, qty);
    }
    setBuySuccess(true);

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingId = `BD-${Math.floor(10000000 + Math.random() * 90000000)}IN`;
    const remainingStock = Math.max(item.stockLevel - qty, 0);

    const confirmMsg: ChatMessage = {
      id: `msg-order-${Date.now()}`,
      sender: 'agent',
      agentName: 'OmniCommerce Fulfillment Engine',
      text: `🎉 **Order Confirmed: #${orderId}**\n\n` +
        `• **Item:** ${item.name} (SKU: \`${item.sku}\`)\n` +
        `• **Quantity:** ${qty} unit(s)\n` +
        `• **Total Amount:** ₹${(item.price * qty).toLocaleString('en-IN')}\n` +
        `• **Storefront Origin:** ${item.marketplace || 'Myntra'} (${item.sourceSystem || item.supplier})\n` +
        `• **Tracking ID:** \`${trackingId}\` (via BlueDart Air Express)\n` +
        `• **Live Inventory Update:** Deducted ${qty} unit(s). Remaining verified stock is now **${remainingStock} units**.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confidence: 99.9,
      suggestedActions: [
        `Track Shipment #${orderId}`,
        'Download Tax Invoice (GST)',
        'Buy a red dress with rupees 1000',
        'Check low-stock alerts'
      ]
    };

    onSendMessage(confirmMsg);

    setTimeout(() => {
      setBuySuccess(false);
      setBuyModalItem(null);
      setBuyQuantity(1);
    }, 1500);
  };

  // Handle Send Message
  const handleSend = (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onSendMessage(userMsg);
    if (!textToSend) setInputText('');

    // Simulate Agent Thinking & Response
    setIsAgentTyping(true);
    setTimeout(() => {
      generateAgentResponse(messageContent);
      setIsAgentTyping(false);
    }, 1000);
  };

  // Realistic AI response generator
  const generateAgentResponse = (userPrompt: string) => {
    const lower = userPrompt.toLowerCase();
    let replyText = '';
    let suggestedActions: string[] = [];
    let relatedSku: string | undefined = undefined;
    let recommendedProducts: InventoryItem[] | undefined = undefined;

    // Check for product search query (e.g., "red dress with rupees 1000", "buy dress", "red dress", "where you are predicting", "which website")
    const isDressQuery = lower.includes('dress') || lower.includes('cloth') || lower.includes('wear') || lower.includes('kurt') || lower.includes('saree') || lower.includes('buy');
    const hasColorRed = lower.includes('red') || lower.includes('maroon') || lower.includes('crimson') || lower.includes('scarlet') || lower.includes('ruby');
    const isOriginQuery = lower.includes('predict') || lower.includes('website') || lower.includes('where') || lower.includes('source') || lower.includes('units') || lower.includes('stock');
    const extractPriceMatch = lower.match(/(?:rupees?|rs\.?|inr|₹|under|below|around|within)?\s*(\d{3,6})/);
    const maxBudget = extractPriceMatch ? parseInt(extractPriceMatch[1], 10) : 1000;

    if (isDressQuery || (hasColorRed && lower.includes('1000'))) {
      // Find matching items from inventory
      const matchingItems = inventoryItems.filter((item) => {
        const matchesCategory = item.category === 'Fashion & Apparel' || item.name.toLowerCase().includes('dress');
        const matchesColor = hasColorRed ? (item.name.toLowerCase().includes('red') || item.name.toLowerCase().includes('crimson') || item.name.toLowerCase().includes('scarlet') || item.name.toLowerCase().includes('ruby') || item.name.toLowerCase().includes('maroon')) : true;
        const matchesBudget = item.price <= maxBudget;
        return matchesCategory && matchesColor && matchesBudget;
      }).slice(0, 5);

      if (matchingItems.length > 0) {
        recommendedProducts = matchingItems;
        replyText = `Found **${matchingItems.length} top-rated Red Dresses** under ₹${maxBudget.toLocaleString('en-IN')} with verified live stock!\n\n` +
          `📦 **Live Data & Warehouse Prediction Origin:**\n` +
          `The stock counts (such as **${matchingItems[0]?.stockLevel} units** for *${matchingItems[0]?.name}*) are live-synced from connected merchant feeds on **Amazon India, Myntra, and Ajio** (Warehouse IDs: HYD-01, BLR-04, DEL-02).\n\n` +
          `🛍️ **Curated Top Matches:**\n` +
          matchingItems.map((item, idx) => `${idx + 1}. **${item.name}**\n   • **₹${item.price.toLocaleString('en-IN')}** | Stock: **${item.stockLevel} units** | Source: **${item.marketplace || 'Myntra'}** (${item.supplier})`).join('\n') +
          `\n\n*Click **"Visit Store Website"** on any item to open the live marketplace page directly, or click **"Buy"** to open 1-Click Fast AI Checkout.*`;
        suggestedActions = [
          `Buy ${matchingItems[0]?.name.slice(0, 24)}... (₹${matchingItems[0]?.price})`,
          'Compare fabric materials & sizes',
          'Apply 10% First Order Coupon',
          'Check low-stock alerts'
        ];
      } else {
        replyText = `I searched our inventory for red dresses under ₹${maxBudget.toLocaleString('en-IN')}. We currently have ethnic and partywear dresses starting from ₹649. Let me fetch the closest available matches for you.`;
        suggestedActions = ['Browse all fashion items', 'Increase budget to ₹1,500', 'Check new arrivals'];
      }
    } else if (isOriginQuery && (lower.includes('website') || lower.includes('predict') || lower.includes('unit') || lower.includes('buy'))) {
      replyText = `🌐 **Inventory Prediction & Connected Websites:**\n\n` +
        `Our AI engine aggregates live inventory feeds across India's premier e-commerce networks:\n\n` +
        `1. **Amazon India (FBA Central):** E.g. *Ruby Casual Pure Cotton Tiered Red Dress* (68 units in stock at Hyderabad HYD-01 warehouse).\n` +
        `2. **Myntra Partner API:** E.g. *Crimson Floral Anarkali Dress* (45 units at Bangalore BLR-04).\n` +
        `3. **Ajio Direct Merchant Network:** E.g. *Scarlet Georgette A-Line Dress* (32 units at Delhi DEL-02).\n` +
        `4. **Flipkart Assured Seller Cloud:** E.g. *Maroon Velvet Festive Dress* (22 units at Chennai MAA-03).\n\n` +
        `💡 You can click the **"Visit Store Website"** link on any card to navigate directly to their official catalog, or click **"Buy"** to simulate 1-click order fulfillment with real-time stock deduction.`;
      suggestedActions = ['Buy a red dress with rupees 1000', 'Show Amazon India items', 'Check low-stock alerts'];
    } else if (lower.includes('low stock') || lower.includes('stock') || lower.includes('inventory')) {
      const lowStockItems = inventoryItems.filter((i) => i.status === 'Critical' || i.status === 'Low Stock');
      replyText = `Found **${lowStockItems.length} items** currently breaching safety stock thresholds.\n\nMost critical: \`${lowStockItems[0]?.sku}\` (${lowStockItems[0]?.name}) has only **${lowStockItems[0]?.stockLevel} units** remaining against a minimum reorder point of ${lowStockItems[0]?.reorderPoint}.`;
      suggestedActions = ['Trigger bulk PO replenishment', 'Email supplier for lead-time update', 'Set backorder badge on product page'];
      relatedSku = lowStockItems[0]?.sku;
    } else if (lower.includes('order') || lower.includes('#ord')) {
      replyText = `Order **#ORD-9824** (Customer: Priya Sharma, Bangalore) is in transit via BlueDart Express (Tracking: \`BD-94028472IN\`). Scheduled delivery: Tomorrow 2:00 PM. No delivery holds detected.`;
      suggestedActions = ['Send tracking SMS to customer', 'View shipping invoice', 'Issue VIP loyalty points'];
    } else if (lower.includes('return') || lower.includes('refund')) {
      replyText = `Category return rate for **Fashion & Apparel** is currently **2.8%** (well within the healthy benchmark of < 4.0%). The highest driver is "size preference" rather than product defects.`;
      suggestedActions = ['Update sizing guide on PDP', 'Enable instant exchange workflow'];
    } else {
      replyText = `Understood! I've logged your request into the OmniCommerce task queue. I am continuously cross-referencing conversion velocities, inventory levels, supplier lead times, and fulfillment SLAs.`;
      suggestedActions = ['Buy a red dress with rupees 1000', 'Check low-stock alerts', 'View gross profit margins by category'];
    }

    const agentMsg: ChatMessage = {
      id: `msg-agent-${Date.now()}`,
      sender: 'agent',
      agentName: 'OmniCommerce AI Concierge',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confidence: 99.1,
      suggestedActions,
      relatedItemSku: relatedSku,
      recommendedProducts
    };

    onSendMessage(agentMsg);
  };

  // Filter inventory
  const filteredInventory = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      item.sku.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      item.supplier.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categoriesList = ['All', ...Array.from(new Set(inventoryItems.map((i) => i.category)))];

  const handleRestockSubmit = () => {
    if (restockModalItem) {
      onRestockItem(restockModalItem.id, restockQty);
      setRestockModalItem(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#14151b] border border-white/[0.08] flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-medium">Critical Stock Alerts</p>
            <p className="text-2xl font-bold text-red-400 tracking-tight mt-1 font-mono">
              {inventoryItems.filter((i) => i.status === 'Critical').length} SKUs
            </p>
            <p className="text-[11px] text-red-400/80 mt-0.5">Immediate Reorder Required</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#14151b] border border-white/[0.08] flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-medium">Total Catalog Value</p>
            <p className="text-2xl font-bold text-white tracking-tight mt-1 font-mono">
              ₹{inventoryItems.reduce((acc, i) => acc + i.stockLevel * i.price, 0).toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-emerald-400 mt-0.5">{inventoryItems.length} Managed Product Lines</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono font-bold text-lg">
            ₹
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#14151b] border border-white/[0.08] flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-medium">AI Support SLA</p>
            <p className="text-2xl font-bold text-purple-400 tracking-tight mt-1 font-mono">99.8%</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">Avg Response: 1.2s</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Bot className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#14151b] border border-white/[0.08] flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-medium">Fulfillment Velocity</p>
            <p className="text-2xl font-bold text-white tracking-tight mt-1 font-mono">1,420 / day</p>
            <p className="text-[11px] text-indigo-400 mt-0.5">+18% Peak Run-rate</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Classic Split-Screen Layout */}
      <div className={gridStyles.splitGrid}>
        {/* Left Side: Interactive AI Support Chat Window */}
        <div className="p-5 lg:p-6 rounded-2xl bg-[#14151c] border border-white/[0.08] shadow-lg shadow-black/40 flex flex-col justify-between h-[640px]">
          {/* Chat Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.07] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white tracking-tight">
                    OmniCommerce AI Concierge
                  </h2>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-xs text-zinc-400">Realtime Customer & Storefront Intelligence</p>
              </div>
            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded border border-white/5">
              Lat: 14ms
            </span>
          </div>

          {/* Chat Messages List (Scrollable Area) */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 mt-1 ${
                      isUser
                        ? 'bg-indigo-600 text-white'
                        : 'bg-purple-950/60 border border-purple-500/30 text-purple-300'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-xs shadow-md'
                        : 'bg-[#0f1015] border border-white/[0.08] text-zinc-200 rounded-tl-xs shadow-sm'
                    }`}
                  >
                    {!isUser && msg.agentName && (
                      <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-white/[0.06]">
                        <span className="text-[10px] font-semibold text-purple-400">
                          {msg.agentName}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">{msg.timestamp}</span>
                      </div>
                    )}

                    <div className="whitespace-pre-line">{msg.text}</div>

                    {/* Recommended Products Card Strip if available */}
                    {!isUser && msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-white/[0.08] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-pink-400 flex items-center gap-1.5">
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Curated Products (Direct Store Links & 1-Click Buy)
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20">
                            Verified Stock Feed
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {msg.recommendedProducts.map((prod, idx) => (
                            <div
                              key={prod.id}
                              className="p-3 rounded-xl bg-[#141620] border border-white/10 hover:border-pink-500/40 transition-all flex flex-col gap-2 shadow-sm"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-base">{prod.imageEmoji || '👗'}</span>
                                    <p className="font-semibold text-white truncate text-xs">
                                      {idx + 1}. {prod.name}
                                    </p>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-400 mt-1">
                                    <span className="font-mono text-zinc-400">{prod.sku}</span>
                                    <span>•</span>
                                    <span className="px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-300 font-medium border border-indigo-500/30">
                                      {prod.marketplace || 'Myntra'}
                                    </span>
                                    <span>•</span>
                                    <span className="text-emerald-400 font-semibold">
                                      Stock: {prod.stockLevel} units
                                    </span>
                                  </div>
                                </div>

                                <div className="shrink-0 text-right">
                                  <span className="text-sm font-bold font-mono text-emerald-400 block">
                                    ₹{prod.price.toLocaleString('en-IN')}
                                  </span>
                                  {prod.rating && (
                                    <span className="text-[10px] text-amber-400 flex items-center justify-end gap-0.5">
                                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                      {prod.rating}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Action Row: Direct Store Website Link + Instant AI Buy */}
                              <div className="flex items-center gap-2 pt-1 border-t border-white/[0.04]">
                                <a
                                  href={prod.storeUrl || `https://www.myntra.com/red-dress`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 py-1.5 px-2.5 text-[11px] font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-white/10"
                                >
                                  <ExternalLink className="w-3 h-3 text-pink-400" />
                                  <span>Visit {prod.marketplace || 'Store'} Website</span>
                                </a>

                                <button
                                  type="button"
                                  onClick={() => setBuyModalItem(prod)}
                                  className="py-1.5 px-3 text-[11px] font-bold bg-pink-600 hover:bg-pink-500 text-white rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                                >
                                  <ShoppingBag className="w-3 h-3" />
                                  <span>Buy (₹{prod.price.toLocaleString('en-IN')})</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick action suggestions */}
                    {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-white/[0.06] space-y-1.5">
                        <span className="text-[10px] uppercase font-semibold text-zinc-400 block">
                          Suggested Directives:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.suggestedActions.map((action, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSend(action)}
                              className="px-2.5 py-1 text-[11px] font-medium bg-[#181a24] hover:bg-[#222533] text-indigo-300 border border-indigo-500/20 rounded-lg transition-colors text-left flex items-center gap-1"
                            >
                              <span>{action}</span>
                              <ChevronRight className="w-3 h-3 text-indigo-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {isUser && (
                      <div className="text-[9px] text-indigo-200/80 text-right mt-1 font-mono">
                        {msg.timestamp}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Agent Typing Indicator */}
            {isAgentTyping && (
              <div className="flex items-center gap-2 text-xs text-purple-300 pl-2">
                <Bot className="w-4 h-4 animate-bounce" />
                <span className="animate-pulse font-mono text-[11px]">
                  OmniCommerce AI is querying inventory database...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="py-2 flex items-center gap-1.5 overflow-x-auto text-[11px] text-zinc-400 shrink-0">
            <span className="text-[10px] uppercase font-semibold text-zinc-400 shrink-0">Quick:</span>
            <button
              onClick={() => handleSend('Check low stock alerts across all categories')}
              className="px-2.5 py-0.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 shrink-0 border border-white/5"
            >
              ⚠️ Low Stock Check
            </button>
            <button
              onClick={() => handleSend('Status on Order #ORD-9824')}
              className="px-2.5 py-0.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 shrink-0 border border-white/5"
            >
              📦 Order #ORD-9824
            </button>
            <button
              onClick={() => handleSend('Explain return rates for Audio')}
              className="px-2.5 py-0.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 shrink-0 border border-white/5"
            >
              🎧 Return Analytics
            </button>
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="pt-2 border-t border-white/[0.07] flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder="Ask OmniCommerce AI anything (e.g. reorder stock, look up orders)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#0f1015] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Right Side: Inventory Health Spreadsheet */}
        <div className="p-5 lg:p-6 rounded-2xl bg-[#14151c] border border-white/[0.08] shadow-lg shadow-black/40 flex flex-col justify-between h-[640px]">
          <div className="space-y-4">
            {/* Header & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.07]">
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <Package className="w-4 h-4 text-indigo-400" />
                  Inventory Health Spreadsheet
                </h2>
                <p className="text-xs text-zinc-400">
                  Automated reorder thresholds & low stock warnings
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#0f1015] border border-white/10 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Critical">Critical</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="In Stock">In Stock</option>
                </select>
              </div>
            </div>

            {/* Search toolbar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Filter by SKU, Product Name, or Supplier..."
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0f1015] border border-white/10 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Spreadsheet Table (Scrollable Container) */}
            <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-[#0e0f14] max-h-[420px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#15171f] text-zinc-400 font-semibold uppercase tracking-wider text-[10px] sticky top-0 z-10 border-b border-white/[0.06]">
                  <tr>
                    <th className="px-3.5 py-2.5">Product & SKU</th>
                    <th className="px-3.5 py-2.5">Source & Origin</th>
                    <th className="px-3.5 py-2.5">Live Stock</th>
                    <th className="px-3.5 py-2.5">Price</th>
                    <th className="px-3.5 py-2.5">Health</th>
                    <th className="px-3.5 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-zinc-300">
                  {filteredInventory.map((item) => {
                    const isCritical = item.status === 'Critical';
                    const isLow = item.status === 'Low Stock';
                    const stockPct = Math.round((item.stockLevel / item.maxCapacity) * 100);

                    return (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-3.5 py-3">
                          <p className="font-semibold text-white truncate max-w-[150px] flex items-center gap-1.5">
                            <span>{item.imageEmoji || '📦'}</span>
                            <span className="truncate">{item.name}</span>
                          </p>
                          <span className="font-mono text-[10px] text-zinc-400">
                            {item.sku}
                          </span>
                        </td>

                        <td className="px-3.5 py-3">
                          <a
                            href={item.storeUrl || `https://www.myntra.com`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-[10px] font-medium transition-colors"
                            title={`Open product page on ${item.marketplace || 'Store'}`}
                          >
                            <span>{item.marketplace || 'Myntra'}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-indigo-400" />
                          </a>
                          <p className="text-[10px] text-zinc-400 mt-0.5 truncate max-w-[120px]">
                            {item.sourceSystem || item.supplier}
                          </p>
                        </td>

                        <td className="px-3.5 py-3 font-mono">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-bold ${
                                isCritical ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-white'
                              }`}
                            >
                              {item.stockLevel}
                            </span>
                            <span className="text-zinc-400 text-[10px]">/ {item.maxCapacity}</span>
                          </div>
                          <p className="text-[9px] text-zinc-400 font-sans">Min: {item.reorderPoint}</p>
                        </td>

                        <td className="px-3.5 py-3 font-mono text-zinc-200">
                          ₹{item.price.toLocaleString('en-IN')}
                        </td>

                        <td className="px-3.5 py-3">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                              isCritical
                                ? 'bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse'
                                : isLow
                                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                : item.status === 'Reordered'
                                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="px-3.5 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setBuyModalItem(item)}
                              className="px-2 py-1 text-[11px] font-bold bg-pink-600/90 hover:bg-pink-500 text-white rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                              title="Buy item"
                            >
                              <ShoppingBag className="w-3 h-3" />
                              <span>Buy</span>
                            </button>
                            <button
                              onClick={() => {
                                setRestockModalItem(item);
                                setRestockQty(item.maxCapacity - item.stockLevel);
                              }}
                              className="px-2 py-1 text-[11px] font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors border border-white/5"
                              title="Reorder wholesale inventory"
                            >
                              Restock
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-3 border-t border-white/[0.07] flex items-center justify-between text-[11px] text-zinc-400">
            <span>Automatic safety stock monitoring: Active</span>
            <span className="font-mono">Catalog sync: 100%</span>
          </div>
        </div>
      </div>

      {/* Restock Modal Dialog */}
      {restockModalItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#161720] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Authorize Purchase Order Restock
              </h3>
              <button
                onClick={() => setRestockModalItem(null)}
                className="text-zinc-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0f1015] border border-white/5 space-y-1">
                <span className="text-zinc-400 font-mono">SKU: {restockModalItem.sku}</span>
                <p className="font-semibold text-white">{restockModalItem.name}</p>
                <div className="flex justify-between text-zinc-400 pt-1">
                  <span>Current Stock: {restockModalItem.stockLevel}</span>
                  <span>Supplier: {restockModalItem.supplier}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-300 font-medium block">Replenishment Quantity (Units):</label>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#0f1015] border border-white/10 text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-between text-zinc-300 font-mono pt-1">
                <span>Estimated PO Value:</span>
                <span className="font-bold text-emerald-400">
                  ₹{Math.round(restockQty * restockModalItem.price * 0.65).toLocaleString('en-IN')} (Wholesale)
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
              <button
                onClick={() => setRestockModalItem(null)}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRestockSubmit}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm"
              >
                Confirm & Dispatch PO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buy & Storefront Navigation Modal */}
      {buyModalItem && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#141622] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Instant AI Purchase & Store Checkout
                  </h3>
                  <p className="text-[11px] text-zinc-400">Verified Marketplace Catalog Integration</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setBuyModalItem(null);
                  setBuySuccess(false);
                }}
                className="text-zinc-400 hover:text-white text-xs p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Product Card Details */}
            <div className="p-4 rounded-xl bg-[#0f1017] border border-white/10 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                    {buyModalItem.imageEmoji || '👗'}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400">SKU: {buyModalItem.sku}</span>
                    <h4 className="font-bold text-white text-sm leading-snug">{buyModalItem.name}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">{buyModalItem.category}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-lg font-bold font-mono text-emerald-400">
                    ₹{buyModalItem.price.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-zinc-400">per unit (Incl. GST)</span>
                </div>
              </div>

              {/* Real-time Origin & Prediction Source Banner */}
              <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-xs text-zinc-300 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-indigo-300 font-semibold flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-indigo-400" />
                    Live Data Source & Prediction Origin
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-mono text-[10px] font-semibold border border-emerald-500/30">
                    Active Stock Feed
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-zinc-300">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Connected Marketplace:</span>
                    <span className="font-semibold text-white">{buyModalItem.marketplace || 'Myntra'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Warehouse Node:</span>
                    <span className="font-semibold text-white">{buyModalItem.sourceSystem || buyModalItem.supplier}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Predicted Live Availability:</span>
                    <span className="font-bold text-emerald-400 font-mono">{buyModalItem.stockLevel} units remaining</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Customer Rating:</span>
                    <span className="font-semibold text-amber-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {buyModalItem.rating || 4.8}★ ({buyModalItem.reviewsCount?.toLocaleString('en-IN') || '1,420'} verified reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <label className="text-xs font-medium text-zinc-300 block">Purchase Quantity:</label>
                  <span className="text-[10px] text-zinc-400">Max {Math.min(buyModalItem.stockLevel, 10)} per order</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBuyQuantity(Math.max(1, buyQuantity - 1))}
                    className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold flex items-center justify-center transition-colors border border-white/10"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-white text-sm">
                    {buyQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBuyQuantity(Math.min(buyModalItem.stockLevel, buyQuantity + 1))}
                    className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold flex items-center justify-center transition-colors border border-white/10"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 font-mono">
                <span className="text-xs text-zinc-400">Total Payable (INR):</span>
                <span className="text-base font-bold text-emerald-400">
                  ₹{(buyModalItem.price * buyQuantity).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Direct External Website Navigation Button */}
            <div className="p-3 rounded-xl bg-[#171926] border border-pink-500/20 flex items-center justify-between gap-3">
              <div className="text-xs">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-pink-400" />
                  View Original Listing on {buyModalItem.marketplace || 'Store'}
                </p>
                <p className="text-[11px] text-zinc-400">Navigate to the external website to see seller reviews & specs</p>
              </div>

              <a
                href={buyModalItem.storeUrl || 'https://www.myntra.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-pink-300 hover:text-pink-200 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 border border-pink-500/30"
              >
                <span>Visit Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setBuyModalItem(null)}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800 rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={buySuccess || buyModalItem.stockLevel === 0}
                onClick={() => handleExecuteBuy(buyModalItem, buyQuantity)}
                className={`px-5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer ${
                  buySuccess
                    ? 'bg-emerald-600 text-white'
                    : buyModalItem.stockLevel === 0
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white'
                }`}
              >
                {buySuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Purchase Confirmed!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Confirm 1-Click Buy (₹{(buyModalItem.price * buyQuantity).toLocaleString('en-IN')})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

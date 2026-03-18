import React, { useState } from 'react';
import { useCoffeeLogic } from './useCoffeeLogic'; 
import StatsModule from './StatsModule';
import ChartModule from './ChartModule';
import TableModule from './TableModule';
import BaristaModule from './BaristaModule';
import GoalModule from './GoalModule';
import MenuSettingsModule from './MenuSettingsModule'; 
import ActivityFeedModule from './ActivityFeedModule';
import CalendarModule from './CalendarModule';
import MarketingModule from './MarketingModule';
import LandingPage from './LandingPage';
import { ExpenseWidget, PnLWidget, CrmWidget, EfficiencyWidget, NetworkRatingWidget, BaristaEfficiencyTableWidget, SalesAnalyticsWidget, StaffWidget, InventoryWidget } from './DashboardWidgets';
import DashboardModals from './DashboardModals';
import PWAModule from './PWAModule';
import WeatherAIWidget from './WeatherAIWidget';
import AdvancedInventory from './AdvancedInventory';
import BaristaCabinet from './BaristaCabinet';
import DeliveryWidget from './DeliveryWidget';

const CoreModule = () => {
  const logic = useCoffeeLogic();
  const [showBaristaCabinet, setShowBaristaCabinet] = useState(false);
  
  const [activeOwnerTab, setActiveOwnerTab] = useState('Сводка');
  const ownerTabs = [
    { id: 'Сводка', icon: '📊', label: 'Главная сводка' },
    { id: 'Журнал', icon: '📋', label: 'Журнал событий' },
    { id: 'Маркетинг', icon: '🎁', label: 'Маркетинг и CRM' },
    { id: 'Команда', icon: '👥', label: 'Персонал и Смены' },
    { id: 'Финансы', icon: '💸', label: 'Расходы и Финансы' },
    { id: 'Склад', icon: '📦', label: 'Склад и Меню' }
  ];

  const [activeManagerTab, setActiveManagerTab] = useState('Операционка');
  const managerTabs = [
    { id: 'Операционка', icon: '⚡', label: 'Операционка' },
    { id: 'Учет', icon: '📦', label: 'Склад и Расходы' },
    { id: 'Команда', icon: '👥', label: 'Персонал и Смены' },
    { id: 'Журнал', icon: '📋', label: 'Журнал событий' }
  ];

  return (
    <div data-theme={logic.isDarkMode ? 'dark' : 'light'} className="theme-wrapper" style={{ padding: logic.currentRole ? '32px' : '0', backgroundColor: 'var(--bg-main)', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column', transition: 'background-color 0.3s ease' }}>
      <style>{`
        .theme-wrapper { --bg-main: #f9fafb; --bg-card: #ffffff; --text-main: #111827; --text-muted: #6b7280; --border-color: #e5e7eb; --btn-bg: #f3f4f6; --shadow-color: rgba(0,0,0,0.05); }
        .theme-wrapper[data-theme="dark"] { --bg-main: #0f172a; --bg-card: #1e293b; --text-main: #f8fafc; --text-muted: #94a3b8; --border-color: #334155; --btn-bg: #334155; --shadow-color: rgba(0,0,0,0.3); }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {logic.currentRole === null ? (
        <LandingPage appData={logic.appData} onRoleSelect={logic.handleRoleRequest} />
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', backgroundColor: 'var(--bg-card)', padding: '20px 32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', overflowX: 'auto' }} className="hide-scroll">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
              <svg width="40" height="40" viewBox="0 0 80 80" fill="none">
                <path d="M40 5 C60 5, 75 20, 75 40 C75 60, 60 75, 40 75 C20 75, 5 60, 5 40 C5 20, 20 5, 40 5 Z" stroke="#3b82f6" strokeWidth="3" strokeDasharray="4 4"/>
                <path d="M25 30 h30 a4 4 0 0 1 4 4 v20 a10 10 0 0 1 -10 10 h-18 a10 10 0 0 1 -10 -10 v-20 a4 4 0 0 1 4 -4 Z" fill="var(--bg-card)" stroke="#3b82f6" strokeWidth="2"/>
                <path d="M59 36 a6 6 0 0 1 0 12 h-3" stroke="#3b82f6" strokeWidth="2"/>
              </svg>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--text-main)', letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>GOURMET COFFEE CO.</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-main)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: '14px' }}>{logic.currentRole === 'Владелец' ? '👑' : logic.currentRole === 'Управляющий' ? '📋' : '☕'}</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '13px' }}>
                      {logic.currentRole} 
                      {logic.currentRole === 'Бариста' ? ` (${logic.loggedInBarista})` : ''}
                    </span>
                  </div>
                  
                  {logic.currentRole === 'Бариста' && (
                    <button onClick={() => setShowBaristaCabinet(true)} style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      📱 Мой кабинет
                    </button>
                  )}

                  <button onClick={() => logic.setCurrentRole(null)} style={{ padding: '6px 12px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                    🚪 Выйти
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'nowrap', marginLeft: '24px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600', backgroundColor: 'var(--bg-main)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                <span style={{ textTransform: 'capitalize' }}>📅 {logic.dateStr}</span><span style={{ color: '#3b82f6', fontWeight: 'bold' }}>⏱️ {logic.timeStr}</span>
              </div>
              {logic.currentRole === 'Владелец' && (
                <button onClick={() => logic.setShowTelegramModal(true)} style={{ padding: '8px 12px', backgroundColor: '#2ca5e0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> Отчет
                </button>
              )}
              {logic.currentRole !== 'Бариста' && (
                <button onClick={() => logic.setShowArchiveModal(true)} style={{ padding: '8px 12px', backgroundColor: 'var(--btn-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                  🗄️ Архив
                </button>
              )}
              <button onClick={() => logic.setIsDarkMode(!logic.isDarkMode)} style={{ padding: '8px 12px', backgroundColor: 'var(--btn-bg)', color: 'var(--text-main)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>{logic.isDarkMode ? '☀️' : '🌙'}</button>
              <button onClick={logic.handleBackup} style={{ padding: '8px 12px', backgroundColor: 'var(--btn-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', whiteSpace: 'nowrap' }}>💾 Бэкап</button>
              <button onClick={() => logic.fileInputRef.current.click()} style={{ padding: '8px 12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', whiteSpace: 'nowrap' }}>📂 Импорт</button>
              <input type="file" accept=".json" ref={logic.fileInputRef} onChange={logic.handleImport} style={{ display: 'none' }} />
            </div>
          </div>

          <PWAModule />

          {/* 👑 ПАНЕЛЬ ВЛАДЕЛЬЦА */}
          {logic.currentRole === 'Владелец' && (
            <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
              
              <div style={{ flex: '0 0 260px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'sticky', top: '32px' }}>
                <h3 style={{ margin: '0 0 12px 12px', fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Навигация</h3>
                {ownerTabs.map(tab => (
                  <button 
                    key={tab.id} 
                    onClick={() => setActiveOwnerTab(tab.id)}
                    style={{ 
                      padding: '14px 20px', 
                      backgroundColor: activeOwnerTab === tab.id ? '#3b82f6' : 'var(--bg-card)', 
                      color: activeOwnerTab === tab.id ? 'white' : 'var(--text-main)', 
                      border: activeOwnerTab === tab.id ? 'none' : '1px solid var(--border-color)', 
                      borderRadius: '12px', 
                      cursor: 'pointer', 
                      fontWeight: 'bold', 
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      boxShadow: activeOwnerTab === tab.id ? '0 10px 15px -3px rgba(59, 130, 246, 0.3)' : 'none'
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}

                <div style={{ marginTop: 'auto', paddingTop: '40px', textAlign: 'center' }}>
                 <button onClick={logic.handleHardReset} style={{ padding: '12px 24px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', width: '100%' }}>💣 Factory Reset</button>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 0, animation: 'fadeIn 0.3s ease' }}>
                
                {activeOwnerTab === 'Сводка' && (
                  <>
                    <WeatherAIWidget allLowStock={logic.allLowStock} baristaEfficiency={logic.baristaEfficiency} hourlyHeatmap={logic.hourlyHeatmap} />
                    <GoalModule currentRevenue={logic.currentRevenue} targetRevenue={46500} />
                    <StatsModule stats={logic.stats} />
                    <PnLWidget currentRevenue={logic.currentRevenue} costOfGoods={logic.costOfGoods} totalManualExpenses={logic.totalManualExpenses} currentNetProfit={logic.currentNetProfit} />
                    <NetworkRatingWidget currentRevenue={logic.currentRevenue} />
                    <SalesAnalyticsWidget categoryStats={logic.categoryStats} catColors={logic.catColors} topSales={logic.topSales} />
                    <ChartModule currentRevenue={logic.currentRevenue} />
                    <div style={{ marginBottom: '24px' }}>
                      <TableModule orders={logic.orders} onCompleteOrder={logic.handleCompleteOrder} onCancelOrder={logic.handleCancelOrder} allowExport={true} />
                    </div>
                  </>
                )}

                {activeOwnerTab === 'Журнал' && (
                  <div style={{ maxWidth: '900px' }}><ActivityFeedModule logs={logic.logs} /></div>
                )}

                {activeOwnerTab === 'Маркетинг' && (
                  <>
                    <MarketingModule promocodes={logic.promocodes} setPromocodes={logic.setPromocodes} cashbackPercent={logic.cashbackPercent} setCashbackPercent={logic.setCashbackPercent} />
                    <CrmWidget clients={logic.clients} sendSmsToClient={logic.sendSmsToClient} />
                  </>
                )}

                {activeOwnerTab === 'Команда' && (
                  <>
                    <StaffWidget baristas={logic.baristas} setBaristas={logic.setBaristas} baristaPins={logic.baristaPins} setBaristaPins={logic.setBaristaPins} baristaStats={logic.baristaStats} setBaristaStats={logic.setBaristaStats} />
                    <CalendarModule schedule={logic.schedule} onUpdateSchedule={logic.handleUpdateSchedule} baristas={logic.baristas} />
                    <BaristaEfficiencyTableWidget baristaEfficiency={logic?.baristaEfficiency || []} baristaStats={logic?.baristaStats || {}} />
                  </>
                )}

                {activeOwnerTab === 'Финансы' && (
                  <ExpenseWidget expText={logic.expText} setExpText={logic.setExpText} expCategory={logic.expCategory} setExpCategory={logic.setExpCategory} expAmount={logic.expAmount} setExpAmount={logic.setExpAmount} handleAddExpense={logic.handleAddExpense} expenses={logic.expenses} />
                )}

                {activeOwnerTab === 'Склад' && (
                  <>
                    <InventoryWidget ingredients={logic.ingredients} onSaveInventory={logic.handleSaveInventory} />
                    <AdvancedInventory ingredients={logic.ingredients} onWriteOff={logic.handleWriteOff} />
                    <MenuSettingsModule menuItems={logic.menuItems} onAddMenuItem={logic.handleAddMenuItem} onEditMenuItem={logic.handleEditMenuItem} onDeleteMenuItem={logic.handleDeleteMenuItem} onUpdateInventory={logic.handleUpdateInventory} />
                  </>
                )}

              </div>
            </div>
          )}

          {/* 👔 ПАНЕЛЬ УПРАВЛЯЮЩЕГО */}
          {logic.currentRole === 'Управляющий' && (
            <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
              
              <div style={{ flex: '0 0 260px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'sticky', top: '32px' }}>
                <h3 style={{ margin: '0 0 12px 12px', fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Панель Менеджера</h3>
                {managerTabs.map(tab => (
                  <button 
                    key={tab.id} 
                    onClick={() => setActiveManagerTab(tab.id)}
                    style={{ 
                      padding: '14px 20px', 
                      backgroundColor: activeManagerTab === tab.id ? '#3b82f6' : 'var(--bg-card)', 
                      color: activeManagerTab === tab.id ? 'white' : 'var(--text-main)', 
                      border: activeManagerTab === tab.id ? 'none' : '1px solid var(--border-color)', 
                      borderRadius: '12px', 
                      cursor: 'pointer', 
                      fontWeight: 'bold', 
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      boxShadow: activeManagerTab === tab.id ? '0 10px 15px -3px rgba(59, 130, 246, 0.3)' : 'none'
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div style={{ flex: 1, minWidth: 0, animation: 'fadeIn 0.3s ease' }}>
                
                {activeManagerTab === 'Операционка' && (
                  <>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', marginBottom: '24px' }}>
                      <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>⚙️ Операционная сводка</h2>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                        <div style={{ padding: '16px', backgroundColor: 'var(--bg-main)', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}><div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>ТЕКУЩАЯ ЗАГРУЗКА</div><div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-main)' }}>{logic.activeOrdersCount} <span style={{fontSize:'14px', fontWeight:'normal', color:'var(--text-muted)', marginLeft: '8px'}}>в очереди</span></div></div>
                        <div style={{ padding: '16px', backgroundColor: 'var(--bg-main)', borderRadius: '12px', borderLeft: '4px solid #10b981' }}><div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>КАССА ЗА ДЕНЬ</div><div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-main)' }}>{logic.currentRevenue.toLocaleString('ru-RU')} ₽</div></div>
                        <div style={{ padding: '16px', backgroundColor: 'var(--bg-main)', borderRadius: '12px', borderLeft: `4px solid ${logic.allLowStock.length > 0 ? '#f59e0b' : '#10b981'}` }}>
                          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                            <span>ОСТАТКИ (КРИТИЧНО)</span>
                            <button onClick={() => logic.setShowProcurementModal(true)} style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', padding: 0 }}>🛒 АВТО-ЗАКУПКА</button>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {logic.allLowStock.length > 0 ? (logic.allLowStock.map(item => (<div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}><span style={{color: 'var(--text-main)'}}>{item.name}</span><strong style={{color: '#ef4444'}}>{item.inventory} {item.unit}</strong></div>))) : (<span style={{color: '#10b981', fontWeight: 'bold', fontSize: '14px'}}>Все товары в наличии ✅</span>)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <DeliveryWidget onAddDeliveryToRevenue={logic.handleAddDeliveryRevenue} />
                    <EfficiencyWidget avgSpeedText={logic.avgSpeedText} hourlyHeatmap={logic.hourlyHeatmap} />
                    <div style={{ marginBottom: '24px' }}>
                      <TableModule orders={logic.orders} onCompleteOrder={logic.handleCompleteOrder} onCancelOrder={logic.handleCancelOrder} allowExport={true} />
                    </div>
                  </>
                )}

                {activeManagerTab === 'Учет' && (
                  <>
                    <ExpenseWidget expText={logic.expText} setExpText={logic.setExpText} expCategory={logic.expCategory} setExpCategory={logic.setExpCategory} expAmount={logic.expAmount} setExpAmount={logic.setExpAmount} handleAddExpense={logic.handleAddExpense} expenses={logic.expenses} />
                    <InventoryWidget ingredients={logic.ingredients} onSaveInventory={logic.handleSaveInventory} />
                    <AdvancedInventory ingredients={logic.ingredients} onWriteOff={logic.handleWriteOff} />
                    
                    {/* 🚀 ДОБАВЛЕНО УПРАВЛЕНИЕ МЕНЮ ДЛЯ МЕНЕДЖЕРА */}
                    <MenuSettingsModule menuItems={logic.menuItems} onAddMenuItem={logic.handleAddMenuItem} onEditMenuItem={logic.handleEditMenuItem} onDeleteMenuItem={logic.handleDeleteMenuItem} onUpdateInventory={logic.handleUpdateInventory} />
                  </>
                )}

                {activeManagerTab === 'Команда' && (
                  <>
                    <StaffWidget baristas={logic.baristas} setBaristas={logic.setBaristas} baristaPins={logic.baristaPins} setBaristaPins={logic.setBaristaPins} baristaStats={logic.baristaStats} setBaristaStats={logic.setBaristaStats} />
                    <CalendarModule schedule={logic.schedule} onUpdateSchedule={logic.handleUpdateSchedule} baristas={logic.baristas} />
                  </>
                )}

                {activeManagerTab === 'Журнал' && (
                  <div style={{ maxWidth: '900px' }}><ActivityFeedModule logs={logic.logs} /></div>
                )}
                
              </div>
            </div>
          )}

          {/* ☕ ПАНЕЛЬ БАРИСТА */}
          {logic.currentRole === 'Бариста' && (
            <BaristaModule 
              onCloseShift={logic.handleCloseShift} 
              onNewOrder={logic.handleCreateOrder} 
              onOpenDrawer={logic.handleOpenDrawer} 
              menuItems={logic.menuItems} 
              stopList={logic.stopList} 
              onToggleStopList={logic.handleToggleStopList} 
              clients={logic.clients} 
              salarySettings={logic.salarySettings} 
              baristaStats={logic.baristaStats} 
              baristas={logic.baristas} 
              promocodes={logic.promocodes} 
              cashbackPercent={logic.cashbackPercent} 
              loggedInBarista={logic.loggedInBarista}
              onRequestBaristaSwitch={(b) => { logic.setPinModal({ isOpen: true, targetRole: 'Смена Бариста', targetBarista: b }); logic.setPinInput(''); logic.setPinError(false); }}
              onRateBarista={logic.handleRateBarista} 
              onAddDeliveryToRevenue={logic.handleAddDeliveryRevenue}
              handleWriteOff={logic.handleWriteOff}
              ingredients={logic.ingredients}
              orders={logic.orders} 
              onCompleteOrder={logic.handleCompleteOrder} 
              onCancelOrder={logic.handleCancelOrder} 
            />
          )}

          <div style={{ marginTop: 'auto', paddingTop: '32px', paddingBottom: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            &copy; {new Date().getFullYear()} GOURMET COFFEE CO. All rights reserved. <br/>
            Platform Owner: <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{logic.appData.ownerName}</span>
          </div>

          <DashboardModals 
            showTelegramModal={logic.showTelegramModal} setShowTelegramModal={logic.setShowTelegramModal}
            currentRevenue={logic.currentRevenue} totalManualExpenses={logic.totalManualExpenses} currentNetProfit={logic.currentNetProfit} topSales={logic.topSales}
            showProcurementModal={logic.showProcurementModal} setShowProcurementModal={logic.setShowProcurementModal} ingredients={logic.ingredients} menuItems={logic.menuItems}
            showArchiveModal={logic.showArchiveModal} setShowArchiveModal={logic.setShowArchiveModal} shiftArchive={logic.shiftArchive}
            onApproveProcurement={logic.handleApproveProcurement}
          />

          <BaristaCabinet 
            isOpen={showBaristaCabinet} 
            onClose={() => setShowBaristaCabinet(false)} 
            baristaName={logic.loggedInBarista} 
            baristaStats={logic.baristaStats} 
            salarySettings={logic.salarySettings} 
          />
        </>
      )}

      {/* Модалка ПИН-кода */}
      {logic.pinModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '16px', width: '320px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main)', fontSize: '20px' }}>
              {logic.pinModal.targetRole === 'Смена Бариста' ? `ПИН-код: ${logic.pinModal.targetBarista}` : `Вход: ${logic.pinModal.targetRole}`}
            </h3>
            <input type="password" maxLength="4" value={logic.pinInput} onChange={(e) => logic.setPinInput(e.target.value.replace(/\D/g, ''))} style={{ width: '120px', fontSize: '32px', textAlign: 'center', padding: '12px', borderRadius: '12px', border: `2px solid ${logic.pinError ? '#ef4444' : 'var(--border-color)'}`, backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', letterSpacing: '8px', marginBottom: '24px' }} autoFocus onKeyDown={(e) => { if (e.key === 'Enter') logic.handlePinSubmit(); }} />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={logic.cancelPin} style={{ padding: '12px 24px', backgroundColor: 'var(--btn-bg)', color: 'var(--text-main)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Отмена</button>
              <button onClick={logic.handlePinSubmit} style={{ padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Войти</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoreModule;
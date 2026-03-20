import React, { useState, useEffect } from 'react';
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
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // 🚀 ДОБАВЛЯЕМ ДЕТЕКТОР МОБИЛЬНОГО ТЕЛЕФОНА
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const [activeOwnerTab, setActiveOwnerTab] = useState('Сводка');
  const [activeManagerTab, setActiveManagerTab] = useState('Операционка');

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.error(e));
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  const ownerTabs = [
    { id: 'Сводка', icon: '📊', label: 'Главная сводка' },
    { id: 'Журнал', icon: '📋', label: 'Журнал событий' },
    { id: 'Маркетинг', icon: '🎁', label: 'Маркетинг и CRM' },
    { id: 'Команда', icon: '👥', label: 'Персонал и Смены' },
    { id: 'Финансы', icon: '💸', label: 'Расходы и Финансы' },
    { id: 'Склад', icon: '📦', label: 'Склад и Меню' }
  ];

  const managerTabs = [
    { id: 'Операционка', icon: '⚡', label: 'Операционка' },
    { id: 'Учет', icon: '📦', label: 'Склад и Расходы' },
    { id: 'Команда', icon: '👥', label: 'Персонал и Смены' },
    { id: 'Журнал', icon: '📋', label: 'Журнал событий' }
  ];

  return (
    <div data-theme={logic.isDarkMode ? 'dark' : 'light'} className="theme-wrapper" style={{ 
      padding: logic.currentRole ? (isFullScreen ? '10px' : (isMobile ? '12px' : '24px')) : '0', 
      backgroundColor: 'var(--bg-main)', 
      minHeight: '100vh', 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      display: 'flex', 
      flexDirection: 'column', 
      transition: 'all 0.3s ease' 
    }}>
      <style>{`
        .theme-wrapper { 
          --bg-main: #f9fafb; --bg-card: #ffffff; --text-main: #111827; 
          --text-muted: #6b7280; --border-color: #e5e7eb; --btn-bg: #f3f4f6; 
          --shadow-color: rgba(0,0,0,0.05); 
        }
        .theme-wrapper[data-theme="dark"] { 
          --bg-main: #0f172a; --bg-card: #1e293b; --text-main: #f8fafc; 
          --text-muted: #94a3b8; --border-color: #334155; --btn-bg: #334155; 
          --shadow-color: rgba(0,0,0,0.3); 
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {logic.currentRole === null ? (
        <LandingPage appData={logic.appData} onRoleSelect={logic.handleRoleRequest} />
      ) : (
        <>
          {/* ВЕРХНЯЯ ПАНЕЛЬ (HEADER) Адаптирована под мобильные */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '16px' : '0', marginBottom: isMobile ? '16px' : '32px', backgroundColor: 'var(--bg-card)', padding: isMobile ? '16px' : '20px 24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', overflowX: 'auto' }} className="hide-scroll">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, width: '100%', justifyContent: isMobile ? 'space-between' : 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '24px' }}>☕</div>
                <div>
                  <h1 style={{ fontSize: '18px', fontWeight: '800', margin: '0', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>GOURMET COFFEE</h1>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#10b981' }}>● {logic.currentRole}</span>
                </div>
              </div>
              
              {/* Кнопка "Выйти" на мобильном уезжает наверх для экономии места */}
              {isMobile && (
                <button onClick={() => logic.setCurrentRole(null)} style={{ padding: '8px 12px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>Выйти</button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: isMobile ? 'wrap' : 'nowrap', width: isMobile ? '100%' : 'auto' }}>
              {!isMobile && (
                <button onClick={toggleFullScreen} style={{ padding: '8px', backgroundColor: 'var(--btn-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer' }}>{isFullScreen ? '↙️' : '🖥️'}</button>
              )}
              <button onClick={() => logic.setIsDarkMode(!logic.isDarkMode)} style={{ padding: '8px', backgroundColor: 'var(--btn-bg)', border: 'none', borderRadius: '8px' }}>{logic.isDarkMode ? '☀️' : '🌙'}</button>
              <button onClick={logic.handleBackup} style={{ padding: '8px 12px', backgroundColor: 'var(--btn-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}>💾 Бэкап</button>
              <button onClick={() => logic.fileInputRef.current.click()} style={{ padding: '8px 12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}>📂 Импорт</button>
              <input type="file" accept=".json" ref={logic.fileInputRef} onChange={logic.handleImport} style={{ display: 'none' }} />
              
              {!isMobile && (
                 <button onClick={() => logic.setCurrentRole(null)} style={{ padding: '8px 12px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>Выйти</button>
              )}
            </div>
          </div>

          <PWAModule />

          {/* ОСНОВНОЙ КОНТЕНТ (Теперь 100% перестраивается в колонку на телефоне) */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '16px' : '24px', alignItems: 'flex-start', flex: 1, width: '100%', maxWidth: '100vw' }}>
            
            {/* САЙДБАР (На мобильном превращается в скроллируемую горизонтальную ленту) */}
            {logic.currentRole !== 'Бариста' && (
              <div className="hide-scroll" style={{ 
                flex: isMobile ? 'none' : '0 0 240px', 
                width: isMobile ? '100%' : 'auto',
                display: 'flex', 
                flexDirection: isMobile ? 'row' : 'column', 
                gap: '8px', 
                position: isMobile ? 'static' : 'sticky', 
                top: '20px',
                overflowX: isMobile ? 'auto' : 'visible',
                paddingBottom: isMobile ? '8px' : '0'
              }}>
                {!isMobile && <h3 style={{ margin: '0 0 10px 10px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Навигация</h3>}
                
                {(logic.currentRole === 'Владелец' ? ownerTabs : managerTabs).map(tab => {
                  const isActive = (logic.currentRole === 'Владелец' ? activeOwnerTab : activeManagerTab) === tab.id;
                  return (
                    <button key={tab.id} onClick={() => logic.currentRole === 'Владелец' ? setActiveOwnerTab(tab.id) : setActiveManagerTab(tab.id)} style={{ 
                      padding: '12px 16px', backgroundColor: isActive ? '#3b82f6' : 'var(--bg-card)', color: isActive ? 'white' : 'var(--text-main)', 
                      border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', 
                      display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s', flexShrink: 0, whiteSpace: 'nowrap'
                    }}>
                      <span style={{ fontSize: '16px' }}>{tab.icon}</span> {tab.label}
                    </button>
                  );
                })}

                {/* Кнопка сброса (на телефоне в конце ленты) */}
                {logic.currentRole === 'Владелец' && (
                  <button onClick={logic.handleHardReset} style={{ flexShrink: 0, padding: '12px 16px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', marginTop: isMobile ? '0' : 'auto' }}>💣 Factory Reset</button>
                )}
              </div>
            )}

            {/* КОНТЕНТНАЯ ОБЛАСТЬ */}
            <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
              {logic.currentRole === 'Владелец' && (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                  {activeOwnerTab === 'Сводка' && (
                    <>
                      <WeatherAIWidget allLowStock={logic.allLowStock} baristaEfficiency={logic.baristaEfficiency} hourlyHeatmap={logic.hourlyHeatmap} />
                      <GoalModule currentRevenue={logic.currentRevenue} targetRevenue={46500} />
                      <StatsModule stats={logic.stats} />
                      <PnLWidget currentRevenue={logic.currentRevenue} costOfGoods={logic.costOfGoods} totalManualExpenses={logic.totalManualExpenses} currentNetProfit={logic.currentNetProfit} />
                      <SalesAnalyticsWidget categoryStats={logic.categoryStats} catColors={logic.catColors} topSales={logic.topSales} />
                      <ChartModule currentRevenue={logic.currentRevenue} />
                      <TableModule orders={logic.orders} onCompleteOrder={logic.handleCompleteOrder} onCancelOrder={logic.handleCancelOrder} allowExport={true} />
                    </>
                  )}
                  {activeOwnerTab === 'Журнал' && <ActivityFeedModule logs={logic.logs} />}
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
                  {activeOwnerTab === 'Финансы' && <ExpenseWidget expText={logic.expText} setExpText={logic.setExpText} expCategory={logic.expCategory} setExpCategory={logic.setExpCategory} expAmount={logic.expAmount} setExpAmount={logic.setExpAmount} handleAddExpense={logic.handleAddExpense} expenses={logic.expenses} />}
                  {activeOwnerTab === 'Склад' && (
                    <>
                      <InventoryWidget ingredients={logic.ingredients} onSaveInventory={logic.handleSaveInventory} />
                      <AdvancedInventory ingredients={logic.ingredients} onWriteOff={logic.handleWriteOff} />
                      <MenuSettingsModule menuItems={logic.menuItems} onAddMenuItem={logic.handleAddMenuItem} onEditMenuItem={logic.handleEditMenuItem} onDeleteMenuItem={logic.handleDeleteMenuItem} onUpdateInventory={logic.handleUpdateInventory} />
                    </>
                  )}
                </div>
              )}

              {logic.currentRole === 'Управляющий' && (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                  {activeManagerTab === 'Операционка' && (
                    <>
                      <DeliveryWidget onAddDeliveryToRevenue={logic.handleAddDeliveryRevenue} />
                      <EfficiencyWidget avgSpeedText={logic.avgSpeedText} hourlyHeatmap={logic.hourlyHeatmap} />
                      <TableModule orders={logic.orders} onCompleteOrder={logic.handleCompleteOrder} onCancelOrder={logic.handleCancelOrder} allowExport={true} />
                    </>
                  )}
                  {activeManagerTab === 'Учет' && (
                    <>
                      <ExpenseWidget expText={logic.expText} setExpText={logic.setExpText} expCategory={logic.expCategory} setExpCategory={logic.setExpCategory} expAmount={logic.expAmount} setExpAmount={logic.setExpAmount} handleAddExpense={logic.handleAddExpense} expenses={logic.expenses} />
                      <InventoryWidget ingredients={logic.ingredients} onSaveInventory={logic.handleSaveInventory} />
                      <MenuSettingsModule menuItems={logic.menuItems} onAddMenuItem={logic.handleAddMenuItem} onEditMenuItem={logic.handleEditMenuItem} onDeleteMenuItem={logic.handleDeleteMenuItem} onUpdateInventory={logic.handleUpdateInventory} />
                    </>
                  )}
                  {activeManagerTab === 'Команда' && (
                    <>
                      <StaffWidget baristas={logic.baristas} setBaristas={logic.setBaristas} baristaPins={logic.baristaPins} setBaristaPins={logic.setBaristaPins} baristaStats={logic.baristaStats} setBaristaStats={logic.setBaristaStats} />
                      <CalendarModule schedule={logic.schedule} onUpdateSchedule={logic.handleUpdateSchedule} baristas={logic.baristas} />
                    </>
                  )}
                  {activeManagerTab === 'Журнал' && <ActivityFeedModule logs={logic.logs} />}
                </div>
              )}

              {logic.currentRole === 'Бариста' && (
                <BaristaModule 
                  onCloseShift={logic.handleCloseShift} onNewOrder={logic.handleCreateOrder} onOpenDrawer={logic.handleOpenDrawer} menuItems={logic.menuItems} stopList={logic.stopList} onToggleStopList={logic.handleToggleStopList} clients={logic.clients} salarySettings={logic.salarySettings} baristaStats={logic.baristaStats} baristas={logic.baristas} promocodes={logic.promocodes} cashbackPercent={logic.cashbackPercent} loggedInBarista={logic.loggedInBarista}
                  onRequestBaristaSwitch={(b) => { logic.setPinModal({ isOpen: true, targetRole: 'Смена Бариста', targetBarista: b }); logic.setPinInput(''); }}
                  onRateBarista={logic.handleRateBarista} onAddDeliveryToRevenue={logic.handleAddDeliveryRevenue} handleWriteOff={logic.handleWriteOff} ingredients={logic.ingredients} orders={logic.orders} onCompleteOrder={logic.handleCompleteOrder} onCancelOrder={logic.handleCancelOrder} 
                />
              )}
            </div>
          </div>

          <DashboardModals 
            showTelegramModal={logic.showTelegramModal} setShowTelegramModal={logic.setShowTelegramModal} currentRevenue={logic.currentRevenue} totalManualExpenses={logic.totalManualExpenses} currentNetProfit={logic.currentNetProfit} topSales={logic.topSales} showProcurementModal={logic.showProcurementModal} setShowProcurementModal={logic.setShowProcurementModal} ingredients={logic.ingredients} menuItems={logic.menuItems} showArchiveModal={logic.showArchiveModal} setShowArchiveModal={logic.setShowArchiveModal} shiftArchive={logic.shiftArchive} onApproveProcurement={logic.handleApproveProcurement}
          />
        </>
      )}

      {logic.pinModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '20px', width: '300px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>ВХОД</h3>
            <input type="password" maxLength="4" value={logic.pinInput} onChange={(e) => logic.setPinInput(e.target.value.replace(/\D/g, ''))} style={{ width: '100%', fontSize: '28px', textAlign: 'center', padding: '10px', borderRadius: '10px', border: `2px solid var(--border-color)`, backgroundColor: 'var(--bg-main)', letterSpacing: '8px' }} autoFocus />
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={logic.cancelPin} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none' }}>ОТМЕНА</button>
              <button onClick={logic.handlePinSubmit} style={{ flex: 1, padding: '10px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>ВОЙТИ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoreModule;
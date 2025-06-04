function openEditEventModal(event) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Convert ISO dates to local format
    const eventDate = new Date(event.startTime).toISOString().split('T')[0];
    const startTime = new Date(event.startTime).toTimeString().slice(0, 5);
    const endTime = new Date(event.endTime).toTimeString().slice(0, 5);
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Edit Event</h3>
          <button class="close-modal">×</button>
        </div>
        <div class="modal-body">
          <form id="edit-event-form">
            <div class="form-group">
              <label for="event-title">Title</label>
              <input type="text" id="event-title" value="${event.title}" required>
            </div>
            <div class="form-group">
              <label for="event-description">Description</label>
              <textarea id="event-description" rows="3">${event.description || ''}</textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="event-date">Date</label>
                <input type="date" id="event-date" value="${eventDate}" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="event-start">Start Time</label>
                <input type="time" id="event-start" value="${startTime}" required>
              </div>
              <div class="form-group">
                <label for="event-end">End Time</label>
                <input type="time" id="event-end" value="${endTime}" required>
              </div>
            </div>
            <div class="form-group">
              <label for="event-location">Location</label>
              <input type="text" id="event-location" value="${event.location || ''}">
            </div>
            <div class="form-group">
              <label for="event-type">Event Type</label>
              <select id="event-type">
                <option value="study-session" ${event.eventType === 'study-session' ? 'selected' : ''}>Study Session</option>
                <option value="group-meeting" ${event.eventType === 'group-meeting' ? 'selected' : ''}>Group Meeting</option>
                <option value="course-deadline" ${event.eventType === 'course-deadline' ? 'selected' : ''}>Course Deadline</option>
                <option value="other" ${event.eventType === 'other' ? 'selected' : ''}>Other</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
              <button type="submit" class="btn">Update Event</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.close-modal').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.querySelector('.cancel-btn').addEventListener('click', () => {
      modal.remove();
    });
    
    document.getElementById('edit-event-form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const eventData = {
        title: document.getElementById('event-title').value,
        description: document.getElementById('event-description').value,
        date: document.getElementById('event-date').value,
        startTime: document.getElementById('event-start').value,
        endTime: document.getElementById('event-end').value,
        location: document.getElementById('event-location').value,
        eventType: document.getElementById('event-type').value
      };
      
      // Combine date and time
      const startDateTime = new Date(`${eventData.date}T${eventData.startTime}`);
      const endDateTime = new Date(`${eventData.date}T${eventData.endTime}`);
      
      const apiEventData = {
        title: eventData.title,
        description: eventData.description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        location: eventData.location,
        eventType: eventData.eventType
      };
      
      // Disable form
      const submitBtn = this.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Updating...';
      
      // Update event
      CalendarService.updateEvent(event.id, apiEventData)
        .then(updatedEvent => {
          // Close modal
          modal.remove();
          
          // Show success message
          showNotificationToast({
            title: 'Event Updated',
            message: 'Your event has been updated successfully.',
            type: 'success'
          });
          
          // Refresh calendar
          loadEventsForDate(new Date(eventData.date).getDate(), getMonthName(new Date(eventData.date).getMonth()));
        })
        .catch(error => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Update Event';
          handleApiError(error);
        });
    });
    
    // Show modal with animation
    setTimeout(() => modal.classList.add('show'), 10);
  }
  
  /**
   * Delete an event
   * @param eventId - Event ID
   * @param eventElement - Event DOM element
   */
  function deleteEvent(eventId, eventElement) {
    // Add loading state
    eventElement.classList.add('deleting');
    
    CalendarService.deleteEvent(eventId)
      .then(() => {
        // Remove event element with animation
        eventElement.classList.add('deleted');
        setTimeout(() => {
          eventElement.remove();
          
          // If no more events, close modal
          const eventsList = document.querySelector('.events-list');
          if (eventsList && !eventsList.querySelector('.event-item:not(.deleted)')) {
            document.querySelector('.modal').remove();
          }
        }, 300);
        
        // Show success message
        showNotificationToast({
          title: 'Event Deleted',
          message: 'Your event has been deleted successfully.',
          type: 'success'
        });
        
        // Refresh main calendar view
        refreshCalendar();
      })
      .catch(error => {
        // Remove loading state
        eventElement.classList.remove('deleting');
        handleApiError(error);
      });
  }
  
  /**
   * Navigate calendar month
   * @param direction - 'prev' or 'next'
   */
  function navigateCalendar(direction) {
    const calendarTitle = document.querySelector('.calendar-title');
    if (!calendarTitle) {
      return;
    }
    
    const currentMonth = calendarTitle.textContent.trim();
    const monthIndex = getMonthIndex(currentMonth);
    
    let newMonthIndex;
    if (direction === 'prev') {
      newMonthIndex = monthIndex - 1;
      if (newMonthIndex < 0) {
        newMonthIndex = 11;
      }
    } else {
      newMonthIndex = monthIndex + 1;
      if (newMonthIndex > 11) {
        newMonthIndex = 0;
      }
    }
    
    const newMonth = getMonthName(newMonthIndex);
    calendarTitle.textContent = newMonth;
    
    // Update calendar dates
    updateCalendarDates(newMonthIndex);
  }
  
  /**
   * Update calendar dates for a given month
   * @param monthIndex - Month index (0-11)
   */
  function updateCalendarDates(monthIndex) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    
    // Create date for the 1st of the month
    const firstDay = new Date(year, monthIndex, 1);
    
    // Get day of week of the 1st (0 = Sunday, 1 = Monday, etc.)
    let dayOfWeek = firstDay.getDay();
    // Convert to Monday-based week (0 = Monday, 6 = Sunday)
    dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    // Get number of days in this month
    const lastDay = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get number of days in previous month
    const prevMonthLastDay = new Date(year, monthIndex, 0);
    const daysInPrevMonth = prevMonthLastDay.getDate();
    
    // Get all date cells
    const dateCells = document.querySelectorAll('.date-cell');
    
    // Reset cells
    dateCells.forEach(cell => {
      cell.classList.remove('today', 'has-event', 'other-month', 'selected');
    });
    
    // Fill in previous month dates
    for (let i = 0; i < dayOfWeek; i++) {
      const dayNumber = daysInPrevMonth - dayOfWeek + i + 1;
      dateCells[i].textContent = dayNumber;
      dateCells[i].classList.add('other-month');
    }
    
    // Fill in current month dates
    for (let i = 0; i < daysInMonth; i++) {
      const cellIndex = dayOfWeek + i;
      dateCells[cellIndex].textContent = i + 1;
      
      // Mark today
      if (monthIndex === currentDate.getMonth() && i + 1 === currentDate.getDate()) {
        dateCells[cellIndex].classList.add('today');
      }
    }
    
    // Fill in next month dates
    const filledCells = dayOfWeek + daysInMonth;
    for (let i = filledCells; i < dateCells.length; i++) {
      dateCells[i].textContent = i - filledCells + 1;
      dateCells[i].classList.add('other-month');
    }
    
    // Load events for the month
    loadEventsForMonth(monthIndex);
  }
  
  /**
   * Load events for a given month
   * @param monthIndex - Month index (0-11)
   */
  function loadEventsForMonth(monthIndex) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    
    // Create date for the 1st of the month
    const startDate = new Date(year, monthIndex, 1);
    
    // Create date for the last day of the month
    const endDate = new Date(year, monthIndex + 1, 0);
    
    // Format dates for API
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    // Get events for month
    ApiService.get(`${API.calendar.events}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`)
      .then(events => {
        // Group events by date
        const eventsByDate = {};
        
        events.forEach(event => {
          const eventDate = new Date(event.startTime);
          const day = eventDate.getDate();
          
          if (!eventsByDate[day]) {
            eventsByDate[day] = [];
          }
          
          eventsByDate[day].push(event);
        });
        
        // Mark dates with events
        const dateCells = document.querySelectorAll('.date-cell');
        const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();
        const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
        
        Object.keys(eventsByDate).forEach(day => {
          const cellIndex = adjustedFirstDay + parseInt(day) - 1;
          if (cellIndex >= 0 && cellIndex < dateCells.length && !dateCells[cellIndex].classList.contains('other-month')) {
            dateCells[cellIndex].classList.add('has-event');
          }
        });
      })
      .catch(handleApiError);
  }
  
  /**
   * Refresh calendar display
   */
  function refreshCalendar() {
    const calendarTitle = document.querySelector('.calendar-title');
    if (!calendarTitle) {
      return;
    }
    
    const currentMonth = calendarTitle.textContent.trim();
    const monthIndex = getMonthIndex(currentMonth);
    
    updateCalendarDates(monthIndex);
  }
  
  /**
   * Get month index from name
   * @param monthName - Month name
   * @returns - Month index (0-11)
   */
  function getMonthIndex(monthName) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return months.findIndex(month => month.toLowerCase() === monthName.toLowerCase());
  }
  
  /**
   * Get month name from index
   * @param monthIndex - Month index (0-11)
   * @returns - Month name
   */
  function getMonthName(monthIndex) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return months[monthIndex];
  }
  
  /**
   * Format event time
   * @param startTime - ISO start time
   * @param endTime - ISO end time
   * @returns - Formatted time string
   */
  function formatEventTime(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const startHours = start.getHours();
    const startMinutes = start.getMinutes();
    const endHours = end.getHours();
    const endMinutes = end.getMinutes();
    
    const startAMPM = startHours >= 12 ? 'PM' : 'AM';
    const endAMPM = endHours >= 12 ? 'PM' : 'AM';
    
    const formattedStartHours = startHours % 12 || 12;
    const formattedEndHours = endHours % 12 || 12;
    
    const formattedStartMinutes = String(startMinutes).padStart(2, '0');
    const formattedEndMinutes = String(endMinutes).padStart(2, '0');
    
    return `${formattedStartHours}:${formattedStartMinutes} ${startAMPM} - ${formattedEndHours}:${formattedEndMinutes} ${endAMPM}`;
  }
  
  /**
   * Format time for display
   * @param timestamp - UNIX timestamp
   * @returns - Formatted time string
   */
  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    
    // If it's today
    if (date.toDateString() === now.toDateString()) {
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      
      return `Today at ${formattedHours}:${minutes} ${ampm}`;
    }
    
    // If it's yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // If it's this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    if (date > oneWeekAgo) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[date.getDay()];
    }
    
    // Otherwise, show date
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    
    return `${month} ${day}`;
  }
  
  /**
   * Navigate sidebar page
   * @param direction - 'prev' or 'next'
   */
  function navigatePage(direction) {
    const activeButton = document.querySelector('.page-button.active');
    if (!activeButton) {
      return;
    }
    
    const pageButtons = document.querySelectorAll('.page-button:not(.prev):not(.next)');
    const currentPage = parseInt(activeButton.textContent.trim());
    
    let nextPage;
    if (direction === 'prev') {
      nextPage = currentPage - 1;
      if (nextPage < 1) {
        return;
      }
    } else {
      nextPage = currentPage + 1;
      if (nextPage > pageButtons.length) {
        return;
      }
    }
    
    // Find and click the button for the next page
    pageButtons.forEach(button => {
      if (parseInt(button.textContent.trim()) === nextPage) {
        button.click();
      }
    });
  }
  
  /**
   * Load page content
   * @param pageNum - Page number
   */
  function loadPageContent(pageNum) {
    // Here you would load different content based on the page number
    // For example, different sets of reminders
    
    // For demonstration, we'll just console log the page number
    console.log(`Loading page ${pageNum}`);
    
    // In a real implementation, you would call your API to get the data for this page
    // For example:
    // ApiService.get(`${API.notifications.all}?page=${pageNum}`)
    //   .then(notifications => {
    //     updateNotificationsUI(notifications);
    //   })
    //   .catch(handleApiError);
  }
  
  /**
   * Update course list in UI
   */
  function updateCourseList() {
    const courseList = document.querySelector('.course-list');
    if (!courseList) {
      return;
    }
    
    // Remove existing courses except the "Add Course" button
    const addCourseButton = courseList.querySelector('.add-course');
    courseList.innerHTML = '';
    courseList.appendChild(addCourseButton);
    
    // Add courses from state
    studySync.courses.forEach(course => {
      const courseItem = document.createElement('div');
      courseItem.className = 'course-item';
      courseItem.innerHTML = `
        <span>${course.code ? `${course.code}: ` : ''}${course.name}</span>
        <button class="remove-btn">×</button>
      `;
      
      courseItem.querySelector('.remove-btn').addEventListener('click', function() {
        if (confirm('Remove this course?')) {
          AcademicService.removeCourse(course.id)
            .then(() => {
              courseItem.remove();
            })
            .catch(handleApiError);
        }
      });
      
      courseList.insertBefore(courseItem, addCourseButton);
    });
  }
  
  /**
   * Update notification UI
   */
  function updateNotificationUI() {
    const unreadCount = studySync.notifications.filter(n => !n.read).length;
    updateNotificationCounter(unreadCount);
  }
  
  /**
   * Update message UI
   */
  function updateMessageUI() {
    // This would be implemented if we had a messages panel in the UI
    console.log('Messages updated');
  }
  
  /**
   * Update calendar UI
   */
  function updateCalendarUI() {
    refreshCalendar();
    
    // If a date is selected, reload events for that date
    const selectedDate = document.querySelector('.date-cell.selected');
    if (selectedDate) {
      const date = selectedDate.textContent.trim();
      const month = document.querySelector('.calendar-title').textContent.trim();
      loadEventsForDate(date, month);
    }
  }
  
  /**
   * Update matches UI
   */
  function updateMatchesUI() {
    // This would be implemented if we had a matches panel in the UI
    console.log('Matches updated');
  }
  
  /**
   * Initialize application
   */
  function initializeApp() {
    // Verify authentication
    AuthService.verifyAuth()
      .then(user => {
        if (!user) {
          // Redirect to login if not authenticated and not already on login page
          if (!window.location.pathname.includes('login')) {
            window.location.href = '/login.html';
          }
          return;
        }
        
        // Load profile data
        return UserService.getProfile();
      })
      .then(profile => {
        if (!profile) {
          return;
        }
        
        // Initialize UI
        initializeUI();
        
        // Load courses
        return AcademicService.getCourses();
      })
      .then(courses => {
        if (!courses) {
          return;
        }
        
        // Update course list in UI
        updateCourseList();
        
        // Load calendar if on profile page
        if (document.querySelector('.calendar-section')) {
          const today = new Date();
          updateCalendarDates(today.getMonth());
          
          // Set calendar title
          const calendarTitle = document.querySelector('.calendar-title');
          if (calendarTitle) {
            calendarTitle.textContent = getMonthName(today.getMonth());
          }
        }
        
        // Load notifications
        return NotificationService.getNotifications();
      })
      .then(notifications => {
        if (!notifications) {
          return;
        }
        
        // Update notification UI
        updateNotificationUI();
        
        // Initialize WebSocket
        initializeSocket();
      })
      .catch(error => {
        console.error('App initialization error:', error);
        
        // If not authenticated and error occurred, redirect to login
        if (!TokenService.isAuthenticated() && !window.location.pathname.includes('login')) {
          window.location.href = '/login.html';
        }
      });
  }
  
  // Initialize app when DOM is ready
  document.addEventListener('DOMContentLoaded', initializeApp);
  
  // Add CSS for notifications
  const style = document.createElement('style');
  style.textContent = `
    .notification-toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 15px 20px;
      background-color: white;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      transform: translateY(100px);
      opacity: 0;
      transition: transform 0.3s, opacity 0.3s;
      z-index: 9999;
      max-width: 320px;
    }
    
    .notification-toast.show {
      transform: translateY(0);
      opacity: 1;
    }
    
    .notification-toast.success {
      border-left: 4px solid var(--success);
    }
    
    .notification-toast.error {
      border-left: 4px solid #ef4444;
    }
    
    .notification-toast.message {
      border-left: 4px solid var(--primary);
    }
    
    .notification-toast.calendar {
      border-left: 4px solid var(--tertiary);
    }
    
    .notification-toast.match {
      border-left: 4px solid var(--secondary);
    }
    
    .notification-toast-title {
      font-weight: 600;
      margin-bottom: 5px;
    }
    
    .notification-toast-message {
      font-size: 0.9rem;
      color: var(--gray);
    }
    
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s, visibility 0.3s;
    }
    
    .modal.show {
      opacity: 1;
      visibility: visible;
    }
    
    .modal-content {
      background-color: white;
      border-radius: 10px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      transform: scale(0.9);
      transition: transform 0.3s;
    }
    
    .modal.show .modal-content {
      transform: scale(1);
    }
    
    .modal-header {
      padding: 15px 20px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .modal-header h3 {
      margin: 0;
      font-size: 1.2rem;
    }
    
    .close-modal {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--gray);
    }
    
    .modal-body {
      padding: 20px;
    }
    
    .event-item {
      display: flex;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
      background-color: #f8fafc;
      position: relative;
      transition: transform 0.3s, opacity 0.3s;
    }
    
    .event-item.study-session {
      border-left: 4px solid var(--primary);
    }
    
    .event-item.group-meeting {
      border-left: 4px solid var(--secondary);
    }
    
    .event-item.course-deadline {
      border-left: 4px solid var(--tertiary);
    }
    
    .event-item.other {
      border-left: 4px solid var(--gray);
    }
    
    .event-item.deleting {
      opacity: 0.6;
    }
    
    .event-item.deleted {
      transform: translateX(100%);
      opacity: 0;
    }
    
    .event-time {
      width: 120px;
      font-size: 0.85rem;
      font-weight: 500;
    }
    
    .event-content {
      flex: 1;
    }
    
    .event-title {
      font-weight: 600;
      margin-bottom: 5px;
    }
    
    .event-description {
      font-size: 0.9rem;
      color: var(--gray);
      margin-bottom: 5px;
    }
    
    .event-location {
      font-size: 0.85rem;
      color: var(--gray);
      display: flex;
      align-items: center;
    }
    
    .event-location svg {
      margin-right: 5px;
    }
    
    .event-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .event-actions button {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--gray);
      padding: 5px;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    
    .event-actions button:hover {
      background-color: #e2e8f0;
    }
    
    .form-row {
      display: flex;
      gap: 10px;
    }
    
    .form-row .form-group {
      flex: 1;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      font-size: 0.9rem;
    }
    
    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-family: inherit;
      font-size: 0.95rem;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
    
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      background-color: var(--primary);
      color: white;
      transition: background-color 0.3s;
    }
    
    .btn:hover {
      background-color: var(--primary-light);
    }
    
    .btn-secondary {
      background-color: #e2e8f0;
      color: var(--dark);
    }
    
    .btn-secondary:hover {
      background-color: #cbd5e1;
    }
    
    .empty-state {
      text-align: center;
      padding: 20px;
      color: var(--gray);
    }
    
    .loading {
      text-align: center;
      padding: 20px;
      color: var(--gray);
    }
    
    .error-state {
      text-align: center;
      padding: 20px;
      color: #ef4444;
    }
    
    .add-event-btn {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .add-event-btn svg {
      margin-right: 5px;
    }
    
    .more-events {
      text-align: center;
      padding: 8px;
      background-color: #f1f5f9;
      border-radius: 6px;
      margin-top: 10px;
      font-size: 0.85rem;
      color: var(--gray);
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .more-events:hover {
      background-color: #e2e8f0;
    }
    
    .counter {
      position: absolute;
      top: -5px;
      right: -5px;
      background-color: var(--primary);
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 0.7rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }
    
    .notifications-panel,
    .search-panel {
      position: fixed;
      top: 70px;
      right: 20px;
      width: 320px;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      z-index: 9000;
      transform: translateY(-20px);
      opacity: 0;
      visibility: hidden;
      transition: transform 0.3s, opacity 0.3s, visibility 0.3s;
      max-height: calc(100vh - 100px);
      display: flex;
      flex-direction: column;
    }
    
    .notifications-panel.show,
    .search-panel.show {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }
    
    .panel-header {
      padding: 15px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .panel-header h3 {
      margin: 0;
      font-size: 1.1rem;
    }
    
    .close-panel {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--gray);
    }
    
    .notifications-list {
      padding: 10px;
      overflow-y: auto;
      max-height: 400px;
    }
    
    .notification-item {
      display: flex;
      align-items: flex-start;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 10px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .notification-item:hover {
      background-color: #f1f5f9;
    }
    
    .notification-item.read {
      opacity: 0.7;
    }
    
    .notification-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      margin-right: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .notification-icon.message {
      background-color: #e0f2fe;
      color: #0ea5e9;
    }
    
    .notification-icon.match {
      background-color: #fce7f3;
      color: #ec4899;
    }
    
    .notification-icon.group {
      background-color: #f3e8ff;
      color: #a855f7;
    }
    
    .notification-icon.event {
      background-color: #fef9c3;
      color: #eab308;
    }
    
    .notification-icon.course {
      background-color: #dcfce7;
      color: #22c55e;
    }
    
    .notification-content {
      flex: 1;
    }
    
    .notification-title {
      font-weight: 500;
      margin-bottom: 3px;
    }
    
    .notification-message {
      font-size: 0.85rem;
      color: var(--gray);
      margin-bottom: 5px;
    }
    
    .notification-time {
      font-size: 0.75rem;
      color: var(--gray);
      opacity: 0.8;
    }
    
    .panel-footer {
      padding: 10px 15px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
    }
    
    .mark-all-read {
      background: none;
      border: none;
      color: var(--primary);
      font-size: 0.85rem;
      cursor: pointer;
      padding: 5px 10px;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    
    .mark-all-read:hover {
      background-color: #f3e8ff;
    }
    
    .search-form {
      padding: 15px;
      display: flex;
      gap: 10px;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .search-input {
      flex: 1;
      padding: 10px 15px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-family: inherit;
      font-size: 0.95rem;
    }
    
    .search-button {
      background-color: var(--primary);
      color: white;
      border: none;
      border-radius: 8px;
      width: 40px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s;
    }
    
    .search-button:hover {
      background-color: var(--primary-light);
    }
    
    .search-categories {
      display: flex;
      padding: 10px 15px;
      gap: 10px;
      overflow-x: auto;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .category-btn {
      background: none;
      border: none;
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 0.85rem;
      cursor: pointer;
      white-space: nowrap;
      transition: background-color 0.3s, color 0.3s;
    }
    
    .category-btn:hover {
      background-color: #f1f5f9;
    }
    
    .category-btn.active {
      background-color: var(--primary);
      color: white;
    }
    
    .search-results {
      padding: 10px 15px;
      overflow-y: auto;
      max-height: 350px;
    }
    
    .search-result-item {
      display: flex;
      align-items: center;
      padding: 12px 10px;
      border-radius: 8px;
      margin-bottom: 10px;
      transition: background-color 0.3s;
    }
    
    .search-result-item:hover {
      background-color: #f1f5f9;
    }
    
    .result-avatar,
    .result-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      margin-right: 12px;
      overflow: hidden;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .result-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .result-icon {
      background-color: #f1f5f9;
      color: var(--gray);
    }
    
    .search-result-item.student .result-icon {
      background-color: #fce7f3;
      color: #ec4899;
    }
    
    .search-result-item.course .result-icon {
      background-color: #e0f2fe;
      color: #0ea5e9;
    }
    
    .search-result-item.group .result-icon {
      background-color: #f3e8ff;
      color: #a855f7;
    }
    
    .result-info {
      flex: 1;
    }
    
    .result-title {
      font-weight: 500;
      margin-bottom: 3px;
    }
    
    .result-subtitle {
      font-size: 0.85rem;
      color: var(--gray);
    }
    
    .connect-btn,
    .add-btn,
    .join-btn {
      background-color: var(--primary);
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .connect-btn:hover,
    .add-btn:hover,
    .join-btn:hover {
      background-color: var(--primary-light);
    }
    
    .connect-btn.connected,
    .add-btn.added,
    .join-btn.joined {
      background-color: #22c55e;
    }
    
    .connect-btn:disabled,
    .add-btn:disabled,
    .join-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  `;
  
  document.head.appendChild(style);
  /**
   * StudySync - Main JavaScript
   * 
   * This script handles all the core functionality of the StudySync platform,
   * including user interactions, API connections, and various features.
   */
  
  // Global application state
  const studySync = {
    user: null,
    courses: [],
    matches: [],
    groups: [],
    events: [],
    notifications: [],
    messages: []
  };
  
  // API endpoints
  const API = {
    base: 'https://api.studysync.com',
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      verify: '/api/auth/verify'
    },
    users: {
      profile: '/api/users/profile',
      preferences: '/api/users/preferences',
      availability: '/api/users/availability'
    },
    academic: {
      institution: '/api/academic/institution',
      courses: '/api/academic/courses',
      progress: '/api/academic/progress'
    },
    matches: {
      all: '/api/matches',
      recommended: '/api/matches/recommended',
      connect: '/api/matches/connect'
    },
    groups: {
      all: '/api/groups',
      create: '/api/groups',
      join: (id) => `/api/groups/${id}/join`,
      leave: (id) => `/api/groups/${id}/leave`
    },
    calendar: {
      events: '/api/calendar/events',
      sync: '/api/calendar/sync'
    },
    messages: {
      all: '/api/messages',
      conversation: (id) => `/api/messages/${id}`,
      markRead: (id) => `/api/messages/${id}/read`
    },
    notifications: {
      all: '/api/notifications',
      markRead: (id) => `/api/notifications/${id}/read`,
      settings: '/api/notifications/settings'
    }
  };
  
  // Token handling
  const TokenService = {
    getToken: () => localStorage.getItem('studysync_token'),
    setToken: (token) => localStorage.setItem('studysync_token', token),
    removeToken: () => localStorage.removeItem('studysync_token'),
    isAuthenticated: () => !!localStorage.getItem('studysync_token')
  };
  
  // API service for making authenticated requests
  const ApiService = {
    /**
     * Make a fetch request with authorization header
     * @param url - API endpoint
     * @param options - Fetch options
     * @returns - Fetch promise
     */
    fetch: async (url, options = {}) => {
      const token = TokenService.getToken();
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };
  
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
  
      try {
        const response = await fetch(`${API.base}${url}`, {
          ...options,
          headers
        });
  
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('API Request Error:', error);
        handleApiError(error);
        throw error;
      }
    },
  
    /**
     * Make a GET request
     * @param url - API endpoint
     * @returns - Fetch promise
     */
    get: (url) => ApiService.fetch(url),
  
    /**
     * Make a POST request
     * @param url - API endpoint
     * @param data - Request body
     * @returns - Fetch promise
     */
    post: (url, data) => ApiService.fetch(url, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
    /**
     * Make a PUT request
     * @param url - API endpoint
     * @param data - Request body
     * @returns - Fetch promise
     */
    put: (url, data) => ApiService.fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  
    /**
     * Make a DELETE request
     * @param url - API endpoint
     * @returns - Fetch promise
     */
    delete: (url) => ApiService.fetch(url, {
      method: 'DELETE'
    })
  };
  
  // Authentication service
  const AuthService = {
    /**
     * Login user and store token
     * @param email - User email
     * @param password - User password
     * @returns - Login request promise
     */
    login: async (email, password) => {
      try {
        const response = await ApiService.post(API.auth.login, { email, password });
        TokenService.setToken(response.token);
        return response.user;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
  
    /**
     * Register new user
     * @param userData - User registration data
     * @returns - Registration request promise
     */
    register: (userData) => ApiService.post(API.auth.register, userData),
  
    /**
     * Logout user and clear token
     */
    logout: () => {
      TokenService.removeToken();
      studySync.user = null;
      window.location.href = '/login.html';
    },
  
    /**
     * Verify user token and load user data
     * @returns - Verification request promise
     */
    verifyAuth: async () => {
      if (!TokenService.isAuthenticated()) {
        return null;
      }
  
      try {
        const userData = await ApiService.get(API.auth.verify);
        studySync.user = userData;
        return userData;
      } catch (error) {
        TokenService.removeToken();
        return null;
      }
    }
  };
  
  // User service
  const UserService = {
    /**
     * Get user profile data
     * @returns - User profile request promise
     */
    getProfile: async () => {
      const profile = await ApiService.get(API.users.profile);
      studySync.user = profile;
      return profile;
    },
  
    /**
     * Update user profile data
     * @param profileData - Updated profile data
     * @returns - Update request promise
     */
    updateProfile: (profileData) => ApiService.put(API.users.profile, profileData),
  
    /**
     * Update user study preferences
     * @param preferences - Updated study preferences
     * @returns - Update request promise
     */
    updatePreferences: (preferences) => ApiService.put(API.users.preferences, preferences),
  
    /**
     * Get user availability schedule
     * @returns - Availability request promise
     */
    getAvailability: async () => {
      const availability = await ApiService.get(API.users.availability);
      return availability;
    },
  
    /**
     * Update user availability schedule
     * @param availabilityData - Updated availability data
     * @returns - Update request promise
     */
    updateAvailability: (availabilityData) => ApiService.put(API.users.availability, availabilityData)
  };
  
  // Academic service
  const AcademicService = {
    /**
     * Get list of institutions
     * @returns - Institutions request promise
     */
    getInstitutions: () => ApiService.get(API.academic.institution),
  
    /**
     * Get user courses
     * @returns - Courses request promise
     */
    getCourses: async () => {
      const courses = await ApiService.get(API.academic.courses);
      studySync.courses = courses;
      return courses;
    },
  
    /**
     * Add a new course
     * @param courseData - Course data
     * @returns - Add course request promise
     */
    addCourse: async (courseData) => {
      const newCourse = await ApiService.post(API.academic.courses, courseData);
      studySync.courses.push(newCourse);
      return newCourse;
    },
  
    /**
     * Remove a course
     * @param courseId - Course ID
     * @returns - Remove course request promise
     */
    removeCourse: async (courseId) => {
      await ApiService.delete(`${API.academic.courses}/${courseId}`);
      studySync.courses = studySync.courses.filter(course => course.id !== courseId);
      return courseId;
    },
  
    /**
     * Get academic progress
     * @returns - Progress request promise
     */
    getProgress: () => ApiService.get(API.academic.progress)
  };
  
  // Match service
  const MatchService = {
    /**
     * Get all matches
     * @returns - Matches request promise
     */
    getMatches: async () => {
      const matches = await ApiService.get(API.matches.all);
      studySync.matches = matches;
      return matches;
    },
  
    /**
     * Get recommended matches
     * @returns - Recommended matches request promise
     */
    getRecommendedMatches: async () => {
      const recommended = await ApiService.get(API.matches.recommended);
      return recommended;
    },
  
    /**
     * Send connect request to a potential match
     * @param userId - User ID to connect with
     * @returns - Connect request promise
     */
    connectWithUser: (userId) => ApiService.post(API.matches.connect, { userId }),
  
    /**
     * Accept a connection request
     * @param matchId - Match ID
     * @returns - Accept request promise
     */
    acceptMatch: (matchId) => ApiService.put(`${API.matches.all}/${matchId}/accept`),
  
    /**
     * Reject a connection request
     * @param matchId - Match ID
     * @returns - Reject request promise
     */
    rejectMatch: (matchId) => ApiService.put(`${API.matches.all}/${matchId}/reject`)
  };
  
  // Group service
  const GroupService = {
    /**
     * Get all study groups
     * @returns - Groups request promise
     */
    getGroups: async () => {
      const groups = await ApiService.get(API.groups.all);
      studySync.groups = groups;
      return groups;
    },
  
    /**
     * Create new study group
     * @param groupData - Group data
     * @returns - Create group request promise
     */
    createGroup: async (groupData) => {
      const newGroup = await ApiService.post(API.groups.create, groupData);
      studySync.groups.push(newGroup);
      return newGroup;
    },
  
    /**
     * Get single group details
     * @param groupId - Group ID
     * @returns - Group details request promise
     */
    getGroupDetails: (groupId) => ApiService.get(`${API.groups.all}/${groupId}`),
  
    /**
     * Join a study group
     * @param groupId - Group ID
     * @returns - Join group request promise
     */
    joinGroup: (groupId) => ApiService.post(API.groups.join(groupId)),
  
    /**
     * Leave a study group
     * @param groupId - Group ID
     * @returns - Leave group request promise
     */
    leaveGroup: (groupId) => ApiService.delete(API.groups.leave(groupId))
  };
  
  // Calendar service
  const CalendarService = {
    /**
     * Get all calendar events
     * @returns - Events request promise
     */
    getEvents: async () => {
      const events = await ApiService.get(API.calendar.events);
      studySync.events = events;
      return events;
    },
  
    /**
     * Create new event
     * @param eventData - Event data
     * @returns - Create event request promise
     */
    createEvent: async (eventData) => {
      const newEvent = await ApiService.post(API.calendar.events, eventData);
      studySync.events.push(newEvent);
      return newEvent;
    },
  
    /**
     * Update event
     * @param eventId - Event ID
     * @param eventData - Updated event data
     * @returns - Update event request promise
     */
    updateEvent: async (eventId, eventData) => {
      const updatedEvent = await ApiService.put(`${API.calendar.events}/${eventId}`, eventData);
      const index = studySync.events.findIndex(event => event.id === eventId);
      if (index !== -1) {
        studySync.events[index] = updatedEvent;
      }
      return updatedEvent;
    },
  
    /**
     * Delete event
     * @param eventId - Event ID
     * @returns - Delete event request promise
     */
    deleteEvent: async (eventId) => {
      await ApiService.delete(`${API.calendar.events}/${eventId}`);
      studySync.events = studySync.events.filter(event => event.id !== eventId);
      return eventId;
    },
  
    /**
     * Sync with external calendar (e.g., Google Calendar)
     * @param syncData - Calendar sync data
     * @returns - Sync request promise
     */
    syncCalendar: (syncData) => ApiService.post(API.calendar.sync, syncData)
  };
  
  // Message service
  const MessageService = {
    /**
     * Get all messages
     * @returns - Messages request promise
     */
    getMessages: async () => {
      const messages = await ApiService.get(API.messages.all);
      studySync.messages = messages;
      return messages;
    },
  
    /**
     * Get conversation with a specific user
     * @param userId - User ID
     * @returns - Conversation request promise
     */
    getConversation: (userId) => ApiService.get(API.messages.conversation(userId)),
  
    /**
     * Send a new message
     * @param messageData - Message data
     * @returns - Send message request promise
     */
    sendMessage: (messageData) => ApiService.post(API.messages.all, messageData),
  
    /**
     * Mark message as read
     * @param messageId - Message ID
     * @returns - Mark read request promise
     */
    markAsRead: (messageId) => ApiService.put(API.messages.markRead(messageId))
  };
  
  // Notification service
  const NotificationService = {
    /**
     * Get all notifications
     * @returns - Notifications request promise
     */
    getNotifications: async () => {
      const notifications = await ApiService.get(API.notifications.all);
      studySync.notifications = notifications;
      return notifications;
    },
  
    /**
     * Mark notification as read
     * @param notificationId - Notification ID
     * @returns - Mark read request promise
     */
    markAsRead: (notificationId) => ApiService.put(API.notifications.markRead(notificationId)),
  
    /**
     * Update notification settings
     * @param settingsData - Updated notification settings
     * @returns - Update settings request promise
     */
    updateSettings: (settingsData) => ApiService.put(API.notifications.settings, settingsData)
  };
  
  // Websocket connection for real-time features
  let socket = null;
  
  /**
   * Initialize WebSocket connection
   */
  function initializeSocket() {
    if (!TokenService.isAuthenticated()) {
      return;
    }
  
    socket = new WebSocket('wss://api.studysync.com/ws');
  
    socket.onopen = () => {
      console.log('WebSocket connection established');
      // Authenticate the WebSocket connection
      socket.send(JSON.stringify({
        type: 'authenticate',
        token: TokenService.getToken()
      }));
    };
  
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleSocketMessage(data);
    };
  
    socket.onclose = () => {
      console.log('WebSocket connection closed');
      // Attempt to reconnect after a delay
      setTimeout(initializeSocket, 3000);
    };
  
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  
  /**
   * Handle incoming WebSocket messages
   * @param data - Message data
   */
  function handleSocketMessage(data) {
    switch (data.type) {
      case 'new_message':
        handleNewMessage(data.payload);
        break;
      case 'new_notification':
        handleNewNotification(data.payload);
        break;
      case 'match_request':
        handleMatchRequest(data.payload);
        break;
      case 'event_update':
        handleEventUpdate(data.payload);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }
  
  /**
   * Handle new message from WebSocket
   * @param message - Message data
   */
  function handleNewMessage(message) {
    // Add to messages array
    studySync.messages.unshift(message);
  
    // Update UI if message list is open
    updateMessageUI();
  
    // Show notification
    showNotificationToast({
      title: `New message from ${message.sender.name}`,
      message: message.content.substring(0, 50) + (message.content.length > 50 ? '...' : ''),
      type: 'message'
    });
  }
  
  /**
   * Handle new notification from WebSocket
   * @param notification - Notification data
   */
  function handleNewNotification(notification) {
    // Add to notifications array
    studySync.notifications.unshift(notification);
  
    // Update UI
    updateNotificationUI();
  
    // Show notification toast
    showNotificationToast({
      title: notification.title,
      message: notification.message,
      type: notification.type
    });
  }
  
  /**
   * Handle match request from WebSocket
   * @param matchRequest - Match request data
   */
  function handleMatchRequest(matchRequest) {
    // Update UI if matches page is open
    updateMatchesUI();
  
    // Show notification
    showNotificationToast({
      title: 'New Match Request',
      message: `${matchRequest.user.name} wants to connect with you!`,
      type: 'match'
    });
  }
  
  /**
   * Handle event update from WebSocket
   * @param eventUpdate - Event update data
   */
  function handleEventUpdate(eventUpdate) {
    // Update events array
    const index = studySync.events.findIndex(event => event.id === eventUpdate.id);
    if (index !== -1) {
      studySync.events[index] = eventUpdate;
    } else {
      studySync.events.push(eventUpdate);
    }
  
    // Update UI if calendar is open
    updateCalendarUI();
  
    // Show notification
    showNotificationToast({
      title: 'Calendar Update',
      message: `${eventUpdate.title} has been ${eventUpdate.action}.`,
      type: 'calendar'
    });
  }
  
  /**
   * Show notification toast
   * @param options - Toast options
   */
  function showNotificationToast(options) {
    const toast = document.createElement('div');
    toast.className = `notification-toast ${options.type}`;
    toast.innerHTML = `
      <div class="notification-toast-title">${options.title}</div>
      <div class="notification-toast-message">${options.message}</div>
    `;
  
    document.body.appendChild(toast);
  
    // Show animation
    setTimeout(() => toast.classList.add('show'), 10);
  
    // Auto dismiss
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }
  
  /**
   * Handle API errors
   * @param error - Error object
   */
  function handleApiError(error) {
    // Check if error is due to authentication
    if (error.message.includes('401')) {
      // Token might be expired, log out
      AuthService.logout();
      return;
    }
  
    // Show error notification
    showNotificationToast({
      title: 'Error',
      message: error.message || 'Something went wrong. Please try again.',
      type: 'error'
    });
  }
  
  /**
   * Initialize UI elements and add event listeners
   */
  function initializeUI() {
    // Quick links navigation
    const quickLinks = document.querySelectorAll('.quicklink-card');
    quickLinks.forEach(link => {
      link.addEventListener('click', function() {
        const linkType = this.querySelector('.quicklink-text').textContent.trim().toLowerCase();
        
        // Switch active tab based on link type
        const tabs = document.querySelectorAll('.profile-tab');
        tabs.forEach(tab => {
          const tabTarget = tab.getAttribute('data-tab');
          if (
            (linkType.includes('academic') && tabTarget === 'academic-info') ||
            (linkType.includes('preferences') && tabTarget === 'study-preferences') ||
            (linkType.includes('availability') && tabTarget === 'availability')
          ) {
            // Activate this tab
            document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding content
            document.querySelectorAll('.profile-tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(tabTarget).classList.add('active');
          }
        });
      });
    });
  
    // Calendar date selection
    const dateCells = document.querySelectorAll('.date-cell');
    dateCells.forEach(cell => {
      cell.addEventListener('click', function() {
        // Remove selected class from all cells
        dateCells.forEach(c => c.classList.remove('selected'));
        // Add selected class to clicked cell
        this.classList.add('selected');
        
        const date = this.textContent.trim();
        const currentMonth = document.querySelector('.calendar-title').textContent.trim();
        
        // Load events for selected date
        loadEventsForDate(date, currentMonth);
      });
    });
  
    // Profile form submission
    const profileForm = document.querySelector('#profile-info .profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const profileData = {
          name: document.getElementById('profile-name').value,
          email: document.getElementById('profile-email').value,
          phone: document.getElementById('profile-phone').value,
          bio: document.getElementById('profile-bio').value,
          interests: Array.from(document.querySelectorAll('.interest-chip:not(.add-interest)')).map(chip => chip.textContent.trim())
        };
        
        UserService.updateProfile(profileData)
          .then(response => {
            showNotificationToast({
              title: 'Success',
              message: 'Profile updated successfully.',
              type: 'success'
            });
          })
          .catch(error => {
            handleApiError(error);
          });
      });
    }
  
    // Academic form submission
    const academicForm = document.querySelector('#academic-info .profile-form');
    if (academicForm) {
      academicForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const academicData = {
          institution: document.getElementById('academic-institution').value,
          major: document.getElementById('academic-major').value,
          year: document.getElementById('academic-year').value,
          courses: Array.from(document.querySelectorAll('.course-item:not(.add-course)')).map(item => item.querySelector('span').textContent.trim())
        };
        
        UserService.updateProfile(academicData)
          .then(response => {
            showNotificationToast({
              title: 'Success',
              message: 'Academic information updated successfully.',
              type: 'success'
            });
          })
          .catch(error => {
            handleApiError(error);
          });
      });
    }
  
    // Study preferences form submission
    const preferencesForm = document.querySelector('#study-preferences .profile-form');
    if (preferencesForm) {
      preferencesForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const preferencesData = {
          learningStyle: {
            visual: document.getElementById('visual').checked,
            auditory: document.getElementById('auditory').checked,
            readingWriting: document.getElementById('reading-writing').checked,
            kinesthetic: document.getElementById('kinesthetic').checked
          },
          studyEnvironment: {
            quiet: document.getElementById('quiet').checked,
            moderateNoise: document.getElementById('moderate-noise').checked,
            backgroundMusic: document.getElementById('background-music').checked
          },
          preferredLocations: Array.from(document.querySelectorAll('#study-preferences .checkbox-item input[type="checkbox"]:checked')).map(cb => cb.id),
          groupSize: document.getElementById('group-size').value
        };
        
        UserService.updatePreferences(preferencesData)
          .then(response => {
            showNotificationToast({
              title: 'Success',
              message: 'Study preferences updated successfully.',
              type: 'success'
            });
          })
          .catch(error => {
            handleApiError(error);
          });
      });
    }
  
    // Availability form submission
    const availabilityForm = document.querySelector('#availability .form-actions');
    if (availabilityForm) {
      availabilityForm.querySelector('.btn').addEventListener('click', function(e) {
        e.preventDefault();
        
        const availabilityData = [];
        const scheduleSlots = document.querySelectorAll('.schedule-slot');
        
        scheduleSlots.forEach(slot => {
          const day = slot.getAttribute('data-day');
          const time = slot.getAttribute('data-time');
          const available = slot.classList.contains('selected');
          
          availabilityData.push({
            day,
            timeSlot: time,
            available
          });
        });
        
        UserService.updateAvailability(availabilityData)
          .then(response => {
            showNotificationToast({
              title: 'Success',
              message: 'Availability updated successfully.',
              type: 'success'
            });
          })
          .catch(error => {
            handleApiError(error);
          });
      });
      
      // Schedule slot selection
      const scheduleSlots = document.querySelectorAll('.schedule-slot');
      scheduleSlots.forEach(slot => {
        slot.addEventListener('click', function() {
          this.classList.toggle('selected');
        });
      });
    }
  
    // Add interest chip
    const addInterestChip = document.querySelector('.add-interest');
    if (addInterestChip) {
      addInterestChip.addEventListener('click', function() {
        const interestName = prompt('Enter a new interest or hobby:');
        if (interestName && interestName.trim()) {
          const interestChip = document.createElement('div');
          interestChip.className = 'interest-chip';
          interestChip.textContent = interestName.trim();
          
          interestChip.addEventListener('click', function() {
            if (confirm('Remove this interest?')) {
              this.remove();
            }
          });
          
          this.parentNode.insertBefore(interestChip, this);
        }
      });
    }
  
    // Add course item
    const addCourseItem = document.querySelector('.add-course');
    if (addCourseItem) {
      addCourseItem.addEventListener('click', function() {
        const courseName = prompt('Enter course name:');
        if (courseName && courseName.trim()) {
          const courseItem = document.createElement('div');
          courseItem.className = 'course-item';
          courseItem.innerHTML = `
            <span>${courseName.trim()}</span>
            <button class="remove-btn">×</button>
          `;
          
          courseItem.querySelector('.remove-btn').addEventListener('click', function() {
            if (confirm('Remove this course?')) {
              this.parentNode.remove();
            }
          });
          
          this.parentNode.insertBefore(courseItem, this);
        }
      });
    }
  
    // Remove buttons for courses
    const removeButtons = document.querySelectorAll('.course-item .remove-btn');
    removeButtons.forEach(button => {
      button.addEventListener('click', function() {
        if (confirm('Remove this course?')) {
          this.parentNode.remove();
        }
      });
    });
  
    // Group size slider
    const groupSizeSlider = document.getElementById('group-size');
    if (groupSizeSlider) {
      const sliderValue = groupSizeSlider.parentNode.querySelector('.slider-value');
      groupSizeSlider.addEventListener('input', function() {
        sliderValue.textContent = `${this.value} people`;
      });
    }
  
    // Navigation tabs
    const profileTabs = document.querySelectorAll('.profile-tab');
    profileTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs
        profileTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Show corresponding content
        const tabId = this.getAttribute('data-tab');
        document.querySelectorAll('.profile-tab-content').forEach(content => {
          content.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');
      });
    });
  
    // Calendar navigation
    const calendarNavButtons = document.querySelectorAll('.calendar-nav svg');
    if (calendarNavButtons.length === 2) {
      // Previous month
      calendarNavButtons[0].addEventListener('click', function() {
        navigateCalendar('prev');
      });
      
      // Next month
      calendarNavButtons[1].addEventListener('click', function() {
        navigateCalendar('next');
      });
    }
  
    // Sidebar pagination
    const paginationButtons = document.querySelectorAll('.page-button');
    paginationButtons.forEach(button => {
      button.addEventListener('click', function() {
        if (this.classList.contains('active') || this.classList.contains('prev') || this.classList.contains('next')) {
          // Handle prev/next navigation
          if (this.classList.contains('prev')) {
            navigatePage('prev');
          } else if (this.classList.contains('next')) {
            navigatePage('next');
          }
          return;
        }
        
        // Remove active class from all buttons
        paginationButtons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        // Load page content
        const pageNum = parseInt(this.textContent.trim());
        loadPageContent(pageNum);
      });
    });
  
    // Notification and search buttons
    const notificationButton = document.querySelector('.notification-icon');
    if (notificationButton) {
      notificationButton.addEventListener('click', function() {
        toggleNotificationsPanel();
      });
    }
  
    const searchButton = document.querySelector('.search-icon');
    if (searchButton) {
      searchButton.addEventListener('click', function() {
        toggleSearchPanel();
      });
    }
  }
  
  /**
   * Toggle notifications panel
   */
  function toggleNotificationsPanel() {
    // Check if panel already exists
    let panel = document.querySelector('.notifications-panel');
    
    if (panel) {
      // Panel exists, so close it
      panel.classList.remove('show');
      setTimeout(() => panel.remove(), 300);
      return;
    }
    
    // Create notifications panel
    panel = document.createElement('div');
    panel.className = 'notifications-panel';
    
    // Add notifications content
    panel.innerHTML = `
      <div class="panel-header">
        <h3>Notifications</h3>
        <button class="close-panel">×</button>
      </div>
      <div class="notifications-list">
        ${studySync.notifications.length ? 
          studySync.notifications.map(notification => `
            <div class="notification-item ${notification.read ? 'read' : ''}">
              <div class="notification-icon ${notification.type}"></div>
              <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${formatTime(notification.timestamp)}</div>
              </div>
            </div>
          `).join('') : 
          '<div class="empty-state">No new notifications</div>'
        }
      </div>
      <div class="panel-footer">
        <button class="mark-all-read">Mark all as read</button>
      </div>
    `;
    
    document.body.appendChild(panel);
    
    // Add event listeners
    panel.querySelector('.close-panel').addEventListener('click', () => {
      panel.classList.remove('show');
      setTimeout(() => panel.remove(), 300);
    });
    
    panel.querySelector('.mark-all-read').addEventListener('click', () => {
      markAllNotificationsAsRead();
    });
    
    // Add click handlers to notification items
    panel.querySelectorAll('.notification-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        // Mark notification as read
        const notification = studySync.notifications[index];
        if (!notification.read) {
          NotificationService.markAsRead(notification.id);
          item.classList.add('read');
        }
        
        // Handle notification action based on type
        handleNotificationAction(notification);
      });
    });
    
    // Show panel with animation
    setTimeout(() => panel.classList.add('show'), 10);
  }
  
  /**
   * Toggle search panel
   */
  function toggleSearchPanel() {
    // Check if panel already exists
    let panel = document.querySelector('.search-panel');
    
    if (panel) {
      // Panel exists, so close it
      panel.classList.remove('show');
      setTimeout(() => panel.remove(), 300);
      return;
    }
    
    // Create search panel
    panel = document.createElement('div');
    panel.className = 'search-panel';
    
    // Add search content
    panel.innerHTML = `
      <div class="panel-header">
        <h3>Search</h3>
        <button class="close-panel">×</button>
      </div>
      <div class="search-form">
        <input type="text" class="search-input" placeholder="Search for students, courses, or groups...">
        <button class="search-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
      </div>
      <div class="search-categories">
        <button class="category-btn active" data-category="all">All</button>
        <button class="category-btn" data-category="students">Students</button>
        <button class="category-btn" data-category="courses">Courses</button>
        <button class="category-btn" data-category="groups">Groups</button>
      </div>
      <div class="search-results">
        <div class="empty-state">Enter a search term to find matches</div>
      </div>
    `;
    
    document.body.appendChild(panel);
    
    // Add event listeners
    panel.querySelector('.close-panel').addEventListener('click', () => {
      panel.classList.remove('show');
      setTimeout(() => panel.remove(), 300);
    });
    
    const searchInput = panel.querySelector('.search-input');
    const searchButton = panel.querySelector('.search-button');
    
    searchInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
        performSearch(this.value);
      }
    });
    
    searchButton.addEventListener('click', () => {
      performSearch(searchInput.value);
    });
    
    // Category buttons
    panel.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        // Update active state
        panel.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Filter results if search has been performed
        if (searchInput.value.trim()) {
          filterSearchResults(this.getAttribute('data-category'));
        }
      });
    });
    
    // Show panel with animation and focus input
    setTimeout(() => {
      panel.classList.add('show');
      searchInput.focus();
    }, 10);
  }
  
  /**
   * Perform search
   * @param query - Search query
   */
  function performSearch(query) {
    if (!query.trim()) {
      return;
    }
    
    const panel = document.querySelector('.search-panel');
    const resultsContainer = panel.querySelector('.search-results');
    const category = panel.querySelector('.category-btn.active').getAttribute('data-category');
    
    // Show loading state
    resultsContainer.innerHTML = '<div class="loading">Searching...</div>';
    
    // Perform search API call
    ApiService.get(`${API.base}/api/search?q=${encodeURIComponent(query)}&category=${category}`)
      .then(results => {
        if (results.length === 0) {
          resultsContainer.innerHTML = '<div class="empty-state">No results found</div>';
          return;
        }
        
        // Process and display results
        let resultsHTML = '';
        
        results.forEach(result => {
          if (result.type === 'student') {
            resultsHTML += `
              <div class="search-result-item student">
                <div class="result-avatar">
                  <img src="${result.avatar || 'images/default-avatar.svg'}" alt="${result.name}">
                </div>
                <div class="result-info">
                  <div class="result-title">${result.name}</div>
                  <div class="result-subtitle">${result.major || ''}</div>
                </div>
                <button class="connect-btn">Connect</button>
              </div>
            `;
          } else if (result.type === 'course') {
            resultsHTML += `
              <div class="search-result-item course">
                <div class="result-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                </div>
                <div class="result-info">
                  <div class="result-title">${result.code}: ${result.name}</div>
                  <div class="result-subtitle">${result.department}</div>
                </div>
                <button class="add-btn">Add</button>
              </div>
            `;
          } else if (result.type === 'group') {
            resultsHTML += `
              <div class="search-result-item group">
                <div class="result-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <div class="result-info">
                  <div class="result-title">${result.name}</div>
                  <div class="result-subtitle">${result.members} members · ${result.focus}</div>
                </div>
                <button class="join-btn">Join</button>
              </div>
            `;
          }
        });
        
        resultsContainer.innerHTML = resultsHTML;
        
        // Add event listeners to result action buttons
        resultsContainer.querySelectorAll('.connect-btn').forEach((btn, index) => {
          btn.addEventListener('click', function() {
            const studentId = results.filter(r => r.type === 'student')[index].id;
            connectWithStudent(studentId, this);
          });
        });
        
        resultsContainer.querySelectorAll('.add-btn').forEach((btn, index) => {
          btn.addEventListener('click', function() {
            const courseData = results.filter(r => r.type === 'course')[index];
            addCourse(courseData, this);
          });
        });
        
        resultsContainer.querySelectorAll('.join-btn').forEach((btn, index) => {
          btn.addEventListener('click', function() {
            const groupId = results.filter(r => r.type === 'group')[index].id;
            joinGroup(groupId, this);
          });
        });
      })
      .catch(error => {
        resultsContainer.innerHTML = `<div class="error-state">Error: ${error.message}</div>`;
      });
  }
  
  /**
   * Filter search results
   * @param category - Category to filter by
   */
  function filterSearchResults(category) {
    const resultsContainer = document.querySelector('.search-results');
    const resultItems = resultsContainer.querySelectorAll('.search-result-item');
    
    if (category === 'all') {
      resultItems.forEach(item => item.style.display = 'flex');
      return;
    }
    
    resultItems.forEach(item => {
      if (item.classList.contains(category)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }
  
  /**
   * Connect with a student
   * @param studentId - Student ID
   * @param button - Connect button element
   */
  function connectWithStudent(studentId, button) {
    button.disabled = true;
    button.textContent = 'Connecting...';
    
    MatchService.connectWithUser(studentId)
      .then(() => {
        button.textContent = 'Connected';
        button.classList.add('connected');
        
        showNotificationToast({
          title: 'Connection Request Sent',
          message: 'The student will be notified of your request.',
          type: 'success'
        });
      })
      .catch(error => {
        button.textContent = 'Connect';
        button.disabled = false;
        handleApiError(error);
      });
  }
  
  /**
   * Add a course
   * @param courseData - Course data
   * @param button - Add button element
   */
  function addCourse(courseData, button) {
    button.disabled = true;
    button.textContent = 'Adding...';
    
    AcademicService.addCourse(courseData)
      .then(() => {
        button.textContent = 'Added';
        button.classList.add('added');
        
        showNotificationToast({
          title: 'Course Added',
          message: `${courseData.code} has been added to your courses.`,
          type: 'success'
        });
        
        // Update UI if on academic info tab
        updateCourseList();
      })
      .catch(error => {
        button.textContent = 'Add';
        button.disabled = false;
        handleApiError(error);
      });
  }
  
  /**
   * Join a group
   * @param groupId - Group ID
   * @param button - Join button element
   */
  function joinGroup(groupId, button) {
    button.disabled = true;
    button.textContent = 'Joining...';
    
    GroupService.joinGroup(groupId)
      .then(() => {
        button.textContent = 'Joined';
        button.classList.add('joined');
        
        showNotificationToast({
          title: 'Group Joined',
          message: 'You have successfully joined the group.',
          type: 'success'
        });
      })
      .catch(error => {
        button.textContent = 'Join';
        button.disabled = false;
        handleApiError(error);
      });
  }
  
  /**
   * Mark all notifications as read
   */
  function markAllNotificationsAsRead() {
    const unreadNotifications = studySync.notifications.filter(n => !n.read);
    if (!unreadNotifications.length) {
      return;
    }
    
    // Update API
    ApiService.put(API.notifications.markRead('all'))
      .then(() => {
        // Update local state
        studySync.notifications.forEach(n => n.read = true);
        
        // Update UI
        const notificationItems = document.querySelectorAll('.notification-item');
        notificationItems.forEach(item => item.classList.add('read'));
        
        // Update notification counter
        updateNotificationCounter(0);
      })
      .catch(handleApiError);
  }
  
  /**
   * Handle notification action
   * @param notification - Notification data
   */
  function handleNotificationAction(notification) {
    switch (notification.type) {
      case 'match':
        // Navigate to matches page
        window.location.href = 'matches.html';
        break;
      case 'message':
        // Open message conversation
        window.location.href = `messages.html?userId=${notification.senderId}`;
        break;
      case 'group':
        // Open group details
        window.location.href = `groups.html?groupId=${notification.groupId}`;
        break;
      case 'event':
        // Open calendar with event focused
        window.location.href = `calendar.html?eventId=${notification.eventId}`;
        break;
      case 'course':
        // Open academic info
        window.location.href = 'profile.html#academic-info';
        break;
      default:
        console.log('No action for notification type:', notification.type);
    }
  }
  
  /**
   * Update notification counter
   * @param count - Notification count
   */
  function updateNotificationCounter(count) {
    const notificationIcon = document.querySelector('.notification-icon');
    
    if (!notificationIcon) {
      return;
    }
    
    let counter = notificationIcon.querySelector('.counter');
    
    if (count === 0) {
      if (counter) {
        counter.remove();
      }
      return;
    }
    
    if (!counter) {
      counter = document.createElement('span');
      counter.className = 'counter';
      notificationIcon.appendChild(counter);
    }
    
    counter.textContent = count > 99 ? '99+' : count;
  }
  
  /**
   * Load events for selected date
   * @param date - Date string
   * @param month - Month string
   */
  function loadEventsForDate(date, month) {
    // Create date object based on selected date
    const selectedDate = new Date();
    const currentDate = new Date();
    const monthIndex = getMonthIndex(month);
    
    selectedDate.setMonth(monthIndex);
    selectedDate.setDate(parseInt(date));
    
    // If the day is in previous/next month, adjust year
    if (monthIndex === 11 && currentDate.getMonth() === 0) {
      selectedDate.setFullYear(currentDate.getFullYear() - 1);
    } else if (monthIndex === 0 && currentDate.getMonth() === 11) {
      selectedDate.setFullYear(currentDate.getFullYear() + 1);
    }
    
    // Format date for API
    const formattedDate = selectedDate.toISOString().split('T')[0];
    
    // Show loading state in appointment area
    const appointmentArea = document.querySelector('.appointment');
    if (appointmentArea) {
      appointmentArea.innerHTML = '<div class="loading">Loading events...</div>';
    }
    
    // Get events for date
    ApiService.get(`${API.calendar.events}?date=${formattedDate}`)
      .then(events => {
        if (!appointmentArea) {
          return;
        }
        
        if (events.length === 0) {
          appointmentArea.innerHTML = `
            <div class="empty-state">
              No events scheduled for ${month} ${date}
              <button class="btn add-event-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Add Event
              </button>
            </div>
          `;
          
          appointmentArea.querySelector('.add-event-btn').addEventListener('click', () => {
            openAddEventModal(formattedDate);
          });
          
          return;
        }
        
        // Display the first event
        const event = events[0];
        appointmentArea.innerHTML = `
          <div class="appointment-header">
            <h4>${event.title}</h4>
            <div class="appointment-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
          </div>
          <div class="appointment-details">
            <div class="appointment-time">${formatEventTime(event.startTime, event.endTime)}</div>
            <div>${event.description || 'No description'}</div>
          </div>
          ${events.length > 1 ? 
            `<div class="more-events">+${events.length - 1} more events</div>` : ''}
        `;
        
        // Add click handler to view all events for this day
        if (events.length > 1) {
          appointmentArea.querySelector('.more-events').addEventListener('click', () => {
            openEventsModal(events, `${month} ${date}`);
          });
        }
      })
      .catch(error => {
        if (appointmentArea) {
          appointmentArea.innerHTML = `<div class="error-state">Error loading events: ${error.message}</div>`;
        }
      });
  }
  
  /**
   * Open modal to add a new event
   * @param date - Date string in YYYY-MM-DD format
   */
  function openAddEventModal(date) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Add New Event</h3>
          <button class="close-modal">×</button>
        </div>
        <div class="modal-body">
          <form id="event-form">
            <div class="form-group">
              <label for="event-title">Title</label>
              <input type="text" id="event-title" required>
            </div>
            <div class="form-group">
              <label for="event-description">Description</label>
              <textarea id="event-description" rows="3"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="event-date">Date</label>
                <input type="date" id="event-date" value="${date}" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="event-start">Start Time</label>
                <input type="time" id="event-start" required>
              </div>
              <div class="form-group">
                <label for="event-end">End Time</label>
                <input type="time" id="event-end" required>
              </div>
            </div>
            <div class="form-group">
              <label for="event-location">Location</label>
              <input type="text" id="event-location">
            </div>
            <div class="form-group">
              <label for="event-type">Event Type</label>
              <select id="event-type">
                <option value="study-session">Study Session</option>
                <option value="group-meeting">Group Meeting</option>
                <option value="course-deadline">Course Deadline</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
              <button type="submit" class="btn">Save Event</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Set default times
    const now = new Date();
    let hours = now.getHours();
    let minutes = Math.ceil(now.getMinutes() / 15) * 15;
    
    if (minutes >= 60) {
      hours += 1;
      minutes = 0;
    }
    
    const startTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    const endTime = `${String(hours + 1).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
    document.getElementById('event-start').value = startTime;
    document.getElementById('event-end').value = endTime;
    
    // Add event listeners
    modal.querySelector('.close-modal').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.querySelector('.cancel-btn').addEventListener('click', () => {
      modal.remove();
    });
    
    document.getElementById('event-form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const eventData = {
        title: document.getElementById('event-title').value,
        description: document.getElementById('event-description').value,
        date: document.getElementById('event-date').value,
        startTime: document.getElementById('event-start').value,
        endTime: document.getElementById('event-end').value,
        location: document.getElementById('event-location').value,
        eventType: document.getElementById('event-type').value
      };
      
      // Combine date and time
      const startDateTime = new Date(`${eventData.date}T${eventData.startTime}`);
      const endDateTime = new Date(`${eventData.date}T${eventData.endTime}`);
      
      const apiEventData = {
        title: eventData.title,
        description: eventData.description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        location: eventData.location,
        eventType: eventData.eventType
      };
      
      // Disable form
      const submitBtn = this.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';
      
      // Create event
      CalendarService.createEvent(apiEventData)
        .then(newEvent => {
          // Close modal
          modal.remove();
          
          // Show success message
          showNotificationToast({
            title: 'Event Created',
            message: 'Your event has been added to the calendar.',
            type: 'success'
          });
          
          // Refresh calendar
          loadEventsForDate(new Date(eventData.date).getDate(), getMonthName(new Date(eventData.date).getMonth()));
        })
        .catch(error => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Save Event';
          handleApiError(error);
        });
    });
    
    // Show modal with animation
    setTimeout(() => modal.classList.add('show'), 10);
  }
  
  /**
   * Open modal to display all events for a day
   * @param events - List of events
   * @param dateDisplay - Formatted date string
   */
  function openEventsModal(events, dateDisplay) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    let eventsHTML = '';
    events.forEach(event => {
      eventsHTML += `
        <div class="event-item ${event.eventType}">
          <div class="event-time">${formatEventTime(event.startTime, event.endTime)}</div>
          <div class="event-content">
            <div class="event-title">${event.title}</div>
            <div class="event-description">${event.description || ''}</div>
            ${event.location ? `<div class="event-location">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              ${event.location}
            </div>` : ''}
          </div>
          <div class="event-actions">
            <button class="edit-event" data-id="${event.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
            </button>
            <button class="delete-event" data-id="${event.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      `;
    });
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Events for ${dateDisplay}</h3>
          <button class="close-modal">×</button>
        </div>
        <div class="modal-body">
          <div class="events-list">
            ${eventsHTML}
          </div>
          <div class="modal-actions">
            <button class="btn add-event-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add Event
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.close-modal').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.querySelector('.add-event-btn').addEventListener('click', () => {
      modal.remove();
      // Extract date from first event
      const dateObj = new Date(events[0].startTime);
      const formattedDate = dateObj.toISOString().split('T')[0];
      openAddEventModal(formattedDate);
    });
    
    // Edit event buttons
    modal.querySelectorAll('.edit-event').forEach((btn, index) => {
      btn.addEventListener('click', function() {
        modal.remove();
        openEditEventModal(events[index]);
      });
    });
    
    // Delete event buttons
    modal.querySelectorAll('.delete-event').forEach((btn, index) => {
      btn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this event?')) {
          const eventId = this.getAttribute('data-id');
          deleteEvent(eventId, this.closest('.event-item'));
        }
      });
    });
    
    // Show modal with animation
    setTimeout(() => modal.classList.add('show'), 10);
  }
  
  /**
   * Open modal to edit an event
   * @param event - Event data
   */
  function openEditEventModal(event) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Convert ISO dates to local format
    const eventDate = new Date(event.startTime).toISOString().split('T')[0];
    const startTime = new Date(event.startTime).toTimeString().slice(0, 5);
    const endTime = new Date(event.endTime).toTimeString().slice(0, 5);
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Edit Event</h3>
          <button class="close-modal">×</button>
        </div>
        <div class="modal-body">
          <form id="edit-event-form">
            <div class="form-group">
              <label for="event-title">Title</label>
              <input type="text" id="event-title" value="${event.title}" required>
            </div>
            <div class="form-group">
              <label for="event-description">Description</label>
              <textarea id="event-description" rows="3">${event.description || ''}</textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="event-date">Date</label>
                <input type="date" id="event-date" value="${eventDate}" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="event-start">Start Time</label>
                <input type="time" id="event-start" value="${startTime}" required>
              </div>
              <div class="form-group">
                <label for="event-end">End Time</label>
                <input type="time" id="event-end" value="${endTime}" required>
              </div>
            </div>
            <div class="form-group">
              <label for="event-location">Location</label>
              <input type="text" id="event-location" value="${event.location || ''}">
            </div>
            <div class="form-group">
              <label for="event-type">Event Type</label>
              <select id="event-type">
                <option value="study-session" ${event.eventType === 'study-session' ? 'selected' : ''}>Study Session</option>
                <option value="group-meeting" ${event.eventType === 'group-meeting' ? 'selected' : ''}>Group Meeting</option>
                <option value="course-deadline" ${event.eventType === 'course-deadline' ? 'selected' : ''}>Course Deadline</option>
                <option value="other" ${event.eventType === 'other' ? 'selected' : ''}>Other</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
              <button type="submit" class="btn">Update Event</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.close-modal').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.querySelector('.cancel-btn').addEventListener('click', () => {
      modal.remove();
    });
    
    document.getElementById('edit-event-form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const eventData = {
        title: document.getElementById('event-title').value,
        description: document.getElementById('event-description').value,
        date: document.getElementById('event-date').value,
        startTime: document.getElementById('event-start').value,
        endTime: document.getElementById('event-end').value,
        location: document.getElementById('event-location').value,
        eventType: document.getElementById('event-type').value
      };
      
      // Combine date and time
      const startDateTime = new Date(`${eventData.date}T${eventData.startTime}`);
      const endDateTime = new Date(`${eventData.date}T${eventData.endTime}`);
      
      const apiEventData = {
        title: eventData.title,
        description: eventData.description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        location: eventData.location,
        eventType: eventData.eventType
      };
      
      // Disable form
      const submitBtn = this.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Updating...';
      
      // Update event
      CalendarService.updateEvent(event.id, apiEventData)
        .then(updatedEvent => {
          // Close modal
          modal.remove();
          
          // Show success message
          showNotificationToast({
            title: 'Event Updated',
            message: 'Your event has been updated successfully.',
            type: 'success'
          });
          
          // Refresh calendar
          loadEventsForDate(new Date(eventData.date).getDate(), getMonthName(new Date(eventData.date).getMonth()));
        })
        .catch(error => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Update Event';
          handleApiError(error);
        });
    });
    
    // Show modal with animation
    setTimeout(() => modal.classList.add('show'), 10);
  }
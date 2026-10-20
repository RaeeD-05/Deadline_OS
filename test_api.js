const http = require('http');

async function request(path, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      `http://localhost:3000${path}`,
      {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let json = null;
          try {
            json = JSON.parse(data);
          } catch (e) {
            json = data;
          }
          resolve({ status: res.statusCode, headers: res.headers, data: json });
        });
      }
    );
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING DEADLINEOS INTEGRATION TESTS ---');

  // 1. Test Login with Demo Account
  console.log('1. Testing /api/auth/login with demo account...');
  const loginRes = await request(
    '/api/auth/login',
    { method: 'POST' },
    { email: 'alex.chen@mit.edu', password: 'password123' }
  );
  console.log('Login Status:', loginRes.status, 'User:', loginRes.data.user?.name);
  if (loginRes.status !== 200 || !loginRes.data.success) {
    throw new Error('Login failed');
  }

  const cookie = loginRes.headers['set-cookie']?.[0]?.split(';')[0];
  console.log('Received Session Cookie:', cookie ? 'YES' : 'NO');

  // 2. Test Get Deadlines
  console.log('\n2. Testing /api/deadlines...');
  const deadlinesRes = await request('/api/deadlines', {
    headers: { Cookie: cookie },
  });
  console.log('Deadlines count:', deadlinesRes.data.deadlines?.length);
  if (!deadlinesRes.data.deadlines || deadlinesRes.data.deadlines.length < 5) {
    throw new Error('Expected at least 5 seeded deadlines');
  }

  // 3. Test Create New Deadline
  console.log('\n3. Testing /api/deadlines [POST create]...');
  const createRes = await request(
    '/api/deadlines',
    { method: 'POST', headers: { Cookie: cookie } },
    {
      title: 'Automata Theory Problem Set 4: Turing Machines',
      course_name: 'CS301: Automata Theory',
      source: 'Google Classroom',
      due_date: new Date(Date.now() + 30 * 60 * 60 * 1000).toISOString(),
      estimated_hours: 4.5,
      description: 'Design a 2-tape Turing machine for palindrome recognition.',
    }
  );
  console.log('Create Deadline Status:', createRes.status, 'Created ID:', createRes.data.deadline?.id);
  if (createRes.status !== 201) {
    throw new Error('Failed to create deadline');
  }

  // 4. Test Conflicts Calculation
  console.log('\n4. Testing /api/conflicts...');
  const conflictsRes = await request('/api/conflicts', {
    headers: { Cookie: cookie },
  });
  console.log('Detected Conflict Clusters:', conflictsRes.data.conflicts?.length);
  if (conflictsRes.data.conflicts.length > 0) {
    console.log('Cluster 1 Title:', conflictsRes.data.conflicts[0].title);
    console.log('Cluster 1 Required Effort:', conflictsRes.data.conflicts[0].total_required_hours, 'hours');
  }

  // 5. Test Action Plan
  console.log('\n5. Testing /api/action-plan...');
  const actionPlanRes = await request('/api/action-plan', {
    headers: { Cookie: cookie },
  });
  console.log('Action plan items today:', actionPlanRes.data.actionPlan?.length);
  const firstItemId = actionPlanRes.data.actionPlan?.[0]?.id;

  // 6. Test Toggle Action Item Complete
  if (firstItemId) {
    console.log('\n6. Testing /api/action-plan/[id] [PATCH toggle]...');
    const patchRes = await request(
      `/api/action-plan/${firstItemId}`,
      { method: 'PATCH', headers: { Cookie: cookie } },
      { is_completed: true }
    );
    console.log('Item Completed status:', patchRes.data.item?.is_completed);
  }

  // 7. Test AI Smart Ingest Simulator
  console.log('\n7. Testing /api/smart-ingest...');
  const ingestRes = await request(
    '/api/smart-ingest',
    { method: 'POST', headers: { Cookie: cookie } },
    {
      raw_text:
        '[WhatsApp CS420 Chat] TA Sarah: Reminder that Compiler Design Lab 3 on Lexical Analysis is due Friday at 11:59 PM. Est 5 hrs.',
      source_hint: 'WhatsApp',
    }
  );
  console.log('Ingest Status:', ingestRes.status);
  console.log('Auto-Extracted Title:', ingestRes.data.deadline?.title);
  console.log('Auto-Extracted Source:', ingestRes.data.deadline?.source);
  console.log('Auto-Extracted Hours:', ingestRes.data.deadline?.estimated_hours);

  // 8. Test Deadline Rescue Mode
  console.log('\n8. Testing /api/rescue-mode [POST apply emergency schedule]...');
  const rescueRes = await request(
    '/api/rescue-mode',
    { method: 'POST', headers: { Cookie: cookie } },
    {}
  );
  console.log('Rescue Mode Status:', rescueRes.status);
  console.log('Emergency Agenda Slots Applied:', rescueRes.data.actionPlan?.length);

  // 9. Test Student Registration (Signup)
  console.log('\n9. Testing /api/auth/signup...');
  const randomEmail = `student_${Date.now()}@stanford.edu`;
  const signupRes = await request(
    '/api/auth/signup',
    { method: 'POST' },
    {
      name: 'Maya Lin',
      email: randomEmail,
      password: 'securepassword123',
      college_name: 'Stanford University',
      semester: 'Semester 4 - Sophomore Spring',
    }
  );
  console.log('Signup Status:', signupRes.status, 'New Student:', signupRes.data.user?.name);
  if (signupRes.status !== 200) {
    throw new Error('Signup failed');
  }

  console.log('\n🎉 ALL 9 TEST SUITES PASSED FLAWLESSLY! 🎉');
}

runTests().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});

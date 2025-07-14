// // src/lib/supabaseClient.js
// import { createClient } from '@supabase/supabase-js'



// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

// console.log('SUPABASE_URL:', supabaseUrl)
// console.log('SUPABASE_KEY:', supabaseKey)

// export const supabase = createClient(supabaseUrl, supabaseKey)
// src/lib/supabaseClient.js

// import { createClient } from '@supabase/supabase-js'


// const SUPABASE_URL = 'https://gjvlrkuaskhldlcwomlh.supabase.co'
// const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqdmxya3Vhc2tobGRsY3dvbWxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNzk0NzAsImV4cCI6MjA2Nzc1NTQ3MH0.i4JEol9k323_0PczYd-PuBn-fdq6f0E_vMkHsOvgDlU'

// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)



import { createClient } from '@supabase/supabase-js'

// Replace with your actual keys
const SUPABASE_URL = 'https://gjvlrkuaskhldlcwomlh.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqdmxya3Vhc2tobGRsY3dvbWxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNzk0NzAsImV4cCI6MjA2Nzc1NTQ3MH0.i4JEol9k323_0PczYd-PuBn-fdq6f0E_vMkHsOvgDlU'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)




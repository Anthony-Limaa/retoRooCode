create table appointments (
    id uuid default uuid_generate_v4() primary key,
    client_name text not null,
    date date not null,
    time time not null,
    service_type text not null,
    created_at timestamptz default now(),
    
    constraint unique_appointment_datetime unique (date, time)
);

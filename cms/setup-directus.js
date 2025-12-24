require('dotenv').config();
const { createDirectus, rest, authentication, login, readCollections, createCollection, updateCollection, createItem, readPermissions, createPermission, readRoles, readFieldsByCollection, createField, updateField, createRelation, readRelations } = require('@directus/sdk');

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('❌ ERROR: ADMIN_EMAIL or ADMIN_PASSWORD not found in environment variables (.env)');
    process.exit(1);
}

async function setup() {
    console.log('🚀 Starting Directus Setup...');

    const client = createDirectus(DIRECTUS_URL).with(authentication()).with(rest());

    try {
        // 1. Authentication
        console.log('🔑 Authenticating...');
        const authResult = await client.login(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log('✅ Authenticated successfully.');
        const token = authResult.access_token;

        // 2. Collection Configuration
        const collectionsData = [
            {
                name: 'globals',
                meta: { singleton: true, icon: 'settings' },
                fields: [
                    { field: 'event_name', type: 'string', meta: { interface: 'input' } },
                    { field: 'event_date', type: 'timestamp', meta: { interface: 'datetime' } },
                    { field: 'show_schedule', type: 'boolean', meta: { interface: 'boolean-checkbox' } },
                    { field: 'show_map', type: 'boolean', meta: { interface: 'boolean-checkbox' } },
                    { field: 'show_feed', type: 'boolean', meta: { interface: 'boolean-checkbox' } },
                    { field: 'show_info', type: 'boolean', meta: { interface: 'boolean-checkbox' } }
                ]
            },
            {
                name: 'news',
                meta: { icon: 'newspaper', display_template: '{{title}}' },
                fields: [
                    { field: 'title', type: 'string', meta: { interface: 'input' } },
                    { field: 'content', type: 'text', meta: { interface: 'input-rich-text-html' } },
                    { field: 'is_pinned', type: 'boolean', meta: { interface: 'boolean-checkbox' } },
                    { field: 'image', type: 'uuid', meta: { interface: 'file-image' } },
                    { field: 'publish_date', type: 'timestamp', meta: { interface: 'datetime' } },
                    { field: 'status', type: 'string', meta: { interface: 'select-dropdown', options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }, { text: 'Archived', value: 'archived' }] } } },
                    { field: 'date_created', type: 'timestamp', meta: { interface: 'datetime', readonly: true } }
                ]
            },
            {
                name: 'schedule',
                meta: { icon: 'calendar_today', display_template: '{{title}}' },
                fields: [
                    { field: 'title', type: 'string', meta: { interface: 'input' } },
                    { field: 'description', type: 'text', meta: { interface: 'input-rich-text-html' } },
                    { field: 'start_time', type: 'timestamp', meta: { interface: 'datetime' } },
                    { field: 'end_time', type: 'timestamp', meta: { interface: 'datetime' } },
                    { field: 'location', type: 'string', meta: { interface: 'input' } },
                    { field: 'icon_type', type: 'string', meta: { interface: 'select-dropdown', options: { choices: [{ text: 'Music', value: 'musical-notes' }, { text: 'Food', value: 'restaurant' }, { text: 'Activity', value: 'fitness' }, { text: 'Speech', value: 'mic' }, { text: 'Other', value: 'help-circle-outline' }] } } },
                    { field: 'day', type: 'string', meta: { interface: 'select-dropdown', options: { choices: [{ text: 'Friday', value: 'Friday' }, { text: 'Saturday', value: 'Saturday' }, { text: 'Sunday', value: 'Sunday' }] } } },
                    { field: 'image', type: 'uuid', meta: { interface: 'file-image' } }
                ]
            },
            {
                name: 'map_locations',
                meta: { icon: 'place', display_template: '{{name}}' },
                fields: [
                    { field: 'name', type: 'string', meta: { interface: 'input' } },
                    { field: 'description', type: 'text', meta: { interface: 'input' } },
                    { field: 'type', type: 'string', meta: { interface: 'select-dropdown', options: { choices: [{ text: 'Stage', value: 'stage' }, { text: 'Food', value: 'food' }, { text: 'Toilet', value: 'toilet' }, { text: 'Entrance', value: 'entrance' }] } } },
                    { field: 'coord_x', type: 'float', meta: { interface: 'input' } },
                    { field: 'coord_y', type: 'float', meta: { interface: 'input' } },
                    { field: 'image', type: 'uuid', meta: { interface: 'file-image' } }
                ]
            },
            {
                name: 'info_items',
                meta: { icon: 'info', display_template: '{{title}}' },
                fields: [
                    { field: 'title', type: 'string', meta: { interface: 'input' } },
                    { field: 'content', type: 'text', meta: { interface: 'input-rich-text-html' } },
                    { field: 'category', type: 'string', meta: { interface: 'select-dropdown', options: { choices: [{ text: 'Transport', value: 'transport' }, { text: 'Rules', value: 'rules' }, { text: 'FAQ', value: 'faq' }, { text: 'Contact', value: 'contact' }] } } },
                    { field: 'sort_order', type: 'integer', meta: { interface: 'input' } }
                ]
            }
        ];

        const existingCollections = await client.request(readCollections()).catch(() => []);

        for (const col of collectionsData) {
            const existing = existingCollections.find(c => c.collection === col.name);

            if (!existing) {
                console.log(`📦 Creating "${col.name}" collection...`);
                try {
                    await client.request(createCollection({
                        collection: col.name,
                        meta: col.meta,
                        schema: {},
                        fields: col.fields
                    }));
                } catch (e) {
                    console.log(`ℹ️ Collection ${col.name} creation failed:`, e.errors?.[0]?.message);
                }
            } else if (existing.meta === null) {
                console.log(`⚙️ Collection "${col.name}" exists but is unmanaged. Adding meta...`);
                try {
                    // Update meta to make it managed/visible
                    await client.request(updateCollection(col.name, {
                        meta: col.meta
                    }));
                    console.log(`✅ Collection "${col.name}" is now managed.`);
                } catch (e) {
                    console.log(`ℹ️ Failed to update meta for ${col.name}:`, e.errors?.[0]?.message);
                }
            }

            // Ensure all fields exist
            console.log(`🔎 Checking fields for "${col.name}"...`);
            const existingFields = await client.request(readFieldsByCollection(col.name)).catch(() => []);
            for (const fieldDef of col.fields) {
                const fieldExists = existingFields.find(f => f.field === fieldDef.field);
                if (!fieldExists) {
                    console.log(`➕ Adding field "${fieldDef.field}" to "${col.name}"...`);
                    try {
                        await client.request(createField(col.name, fieldDef));
                    } catch (e) {
                        console.log(`ℹ️ Failed to add field ${fieldDef.field}:`, e.errors?.[0]?.message);
                    }
                } else {
                    // Update meta if field exists but was basic
                    console.log(`⚙️ Updating meta for "${fieldDef.field}" in "${col.name}"...`);
                    try {
                        await client.request(updateField(col.name, fieldDef.field, {
                            meta: fieldDef.meta
                        }));
                    } catch (e) {
                        console.log(`ℹ️ Failed to update field ${fieldDef.field}:`, e.errors?.[0]?.message);
                    }
                }
            }
        }

        // 3. Relationships (Essential for Image/File selection)
        console.log('🔗 Setting up relationships...');
        const relationsData = [
            { collection: 'news', field: 'image', related_collection: 'directus_files' },
            { collection: 'schedule', field: 'image', related_collection: 'directus_files' },
            { collection: 'map_locations', field: 'image', related_collection: 'directus_files' }
        ];

        const existingRelations = await client.request(readRelations()).catch(() => []);

        for (const rel of relationsData) {
            const exists = existingRelations.find(r => r.collection === rel.collection && r.field === rel.field);
            if (!exists) {
                console.log(`➕ Creating relationship for ${rel.collection}.${rel.field}...`);
                try {
                    await client.request(createRelation({
                        collection: rel.collection,
                        field: rel.field,
                        related_collection: rel.related_collection,
                        schema: {
                            on_delete: 'SET NULL'
                        },
                        meta: {
                            interface: 'file-image',
                            options: {
                                display: 'file-image'
                            }
                        }
                    }));
                } catch (e) {
                    console.log(`ℹ️ Relationship for ${rel.collection}.${rel.field} failed:`, e.errors?.[0]?.message);
                }
            }
        }

        // 4. Permissions (Public Access)
        console.log('🔓 Setting Public permissions...');
        const policiesResponse = await fetch(`${DIRECTUS_URL}/policies`, { headers: { Authorization: `Bearer ${token}` } });
        const policies = (await policiesResponse.json()).data || [];
        const publicPolicy = policies.find(p => p.name.toLowerCase().includes('public'));

        const collectionsToGrant = ['globals', 'news', 'schedule', 'map_locations', 'info_items', 'directus_files'];

        for (const collection of collectionsToGrant) {
            const payload = {
                collection,
                action: 'read',
                fields: ['*'],
                permissions: {},
                validation: {}
            };

            if (publicPolicy) {
                payload.policy = publicPolicy.id;
            } else {
                payload.role = null;
            }

            try {
                const existingResponse = await fetch(`${DIRECTUS_URL}/permissions?filter[collection][_eq]=${collection}&filter[action][_eq]=read`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const existing = (await existingResponse.json()).data;

                if (existing.length > 0) {
                    await fetch(`${DIRECTUS_URL}/permissions/${existing[0].id}`, {
                        method: 'PATCH',
                        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    console.log(`✅ Updated permissions for ${collection}`);
                } else {
                    await fetch(`${DIRECTUS_URL}/permissions`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    console.log(`✅ Granted permissions for ${collection}`);
                }
            } catch (err) {
                console.log(`ℹ️ Permission for ${collection} failed.`);
            }
        }

        // 4. Seed Data
        console.log('🌱 Seeding initial data...');
        const seedItems = [
            { collection: 'globals', item: { event_name: 'Jason & Vero 12.5 Fest', event_date: new Date('2025-12-25T20:00:00Z').toISOString(), show_schedule: true, show_map: true, show_feed: true, show_info: true } },
            { collection: 'news', item: { title: 'Welcome to the Fest!', content: 'We are so excited!', is_pinned: true, status: 'published', date_created: new Date().toISOString(), publish_date: new Date().toISOString() } },
            { collection: 'schedule', item: { title: 'Opening Ceremony', start_time: '2025-12-25T18:00:00Z', end_time: '2025-12-25T19:00:00Z', location: 'Main Stage', icon_type: 'speech', day: 'Friday' } },
            { collection: 'map_locations', item: { name: 'Main Stage', type: 'stage', coord_x: 50, coord_y: 80 } },
            // Info Items Dummy Data
            { collection: 'info_items', item: { title: 'Parkeren & Pendelbussen', category: 'transport', sort_order: 1, content: '<p>Er is ruim voldoende parkeergelegenheid bij de ingang. Pendelbussen rijden elke 15 minuten vanaf Station Utrecht Centraal.</p>' } },
            { collection: 'info_items', item: { title: 'Fietsenstalling', category: 'transport', sort_order: 2, content: '<p>Je kunt je fiets gratis stallen in de bewaakte fietsenstalling nabij de hoofdingang.</p>' } },
            { collection: 'info_items', item: { title: 'Alcohol & Roken', category: 'rules', sort_order: 1, content: '<p>Roken is alleen toegestaan in de aangegeven rookzones. Alcohol wordt niet geschonken aan personen onder de 18 jaar.</p>' } },
            { collection: 'info_items', item: { title: 'Zero Tolerance Beleid', category: 'rules', sort_order: 2, content: '<p>Wij hanteren een zero tolerance beleid ten aanzien van drugs en agressie.</p>' } },
            { collection: 'info_items', item: { title: 'Kan ik pinnen?', category: 'faq', sort_order: 1, content: '<p>Ja, het hele festival is <strong>cashless</strong>. Je kunt overal met pin of contactloos betalen.</p>' } },
            { collection: 'info_items', item: { title: 'Zijn er kluisjes?', category: 'faq', sort_order: 2, content: '<p>Zeker! Er zijn kluisjes beschikbaar bij de infobalie. Huurprijs is €5,- per dag.</p>' } },
            { collection: 'info_items', item: { title: 'Organisatie', category: 'contact', sort_order: 1, content: '<p>Vragen voor de organisatie? Mail ons op <a href="mailto:info@jasonvero.com">info@jasonvero.com</a>.</p>' } }
        ];

        for (const s of seedItems) {
            try {
                await client.request(createItem(s.collection, s.item));
                console.log(`✅ Seeded ${s.collection}.`);
            } catch (e) { }
        }

        console.log('✨ Setup Complete! Refresh the Directus UI to see the new collections.');

    } catch (error) {
        console.error('❌ Setup failed:', error);
    }
}

setup();
